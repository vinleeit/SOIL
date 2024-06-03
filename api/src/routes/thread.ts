import express from "express";
import { body, param, validationResult } from "express-validator";
import { validateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Custom validation function to check if a user exists
const userExists = async (userId: string, req: express.Request) => {
  console.log(userId);
  const user = await req.models.User.findByPk(parseInt(userId));
  if (!user) {
    throw new Error("User not found");
  }
};

// Custom validation function to check if a thread exists
const threadExists = async (threadId: number, req: express.Request) => {
  const thread = await req.models.Thread.findByPk(threadId);
  if (!thread) {
    throw new Error("Thread not found");
  }
};

// Add a thread to a review
router.post(
  "/:reviewId/review",
  [
    body("content").notEmpty().withMessage("Content is required"),
    body("parentThreadID")
      .optional()
      .isInt()
      .withMessage("Parent thread ID must be an integer"),
    param("reviewId").isInt().withMessage("Review ID must be an integer"),
  ],
  validateToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reviewId } = req.params;
    const { content, parentThreadID } = req.body;
    const userID = req.user;

    try {
      await userExists(userID, req);

      // Check if parent thread actually exists
      if (parentThreadID) {
        await threadExists(parentThreadID, req);
      }

      // Create thread
      const thread = await req.models.Thread.create({
        content,
        reviewID: parseInt(reviewId),
        userID: parseInt(userID),
        parentThreadID,
      });
      // Set the id for the return value
      thread.setDataValue("threadID", thread.threadID);

      res.status(201).json(thread);
    } catch (error) {
      //@ts-ignore
      res.status(400).json({ error: error.message });
    }
  },
);

// Add a thread to another thread
router.post(
  "/:reviewId/thread/:threadId/",
  [
    body("content").notEmpty().withMessage("Content is required"),
    param("threadId").isInt().withMessage("Thread ID must be an integer"),
    param("reviewId").isInt().withMessage("Review ID must be an integer"),
  ],
  validateToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { threadId, reviewId } = req.params;
    const { content } = req.body;
    const userID = req.user;

    try {
      // Check if the thread exists
      await threadExists(parseInt(threadId), req);

      // Check if user that add the product still exists (or abaandoned token)
      const currentUser = await req.models.User.findOne({
        where: { id: userID },
      });
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Blocked user cannot leave review
      if (currentUser.dataValues.isBlocked) {
        return res
          .status(403)
          .json({ message: "Blocked user cannot leave review" });
      }

      // Create thread
      const thread = await req.models.Thread.create({
        content,
        userID: parseInt(userID),
        parentThreadID: parseInt(threadId),
        reviewID: parseInt(reviewId),
      });

      // Set thread id for return value
      thread.setDataValue("threadID", thread.threadID);

      res.status(201).json(thread);
    } catch (error) {
      //@ts-ignore
      res.status(400).json({ error: error.message });
    }
  },
);

// Update a thread
router.put(
  "/:threadId",
  [
    body("content").notEmpty().withMessage("Content is required"),
    param("threadId").isInt().withMessage("Thread ID must be an integer"),
  ],
  validateToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { threadId } = req.params;
    const { content } = req.body;
    const userID = req.user;

    try {
      // Check if user and thread exits
      await userExists(userID, req);
      await threadExists(parseInt(threadId), req);

      // Find thread
      const thread = await req.models.Thread.findOne({
        where: {
          threadID: threadId,
          userID,
        },
      });

      // Check if thread exists or if the user own the thread
      if (!thread) {
        return res
          .status(404)
          .json({ error: "Thread not found or unauthorized" });
      }

      // Set content and update
      thread.setDataValue("content", content);
      await thread.save();

      res.json(thread);
    } catch (error) {
      //@ts-ignore
      res.status(400).json({ error: error.message });
    }
  },
);

// Delete a thread
router.delete(
  "/:threadId",
  [param("threadId").isInt().withMessage("Thread ID must be an integer")],
  validateToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { threadId } = req.params;
    const userID = req.user;

    try {
      // Check if user and thread exits
      await userExists(userID, req);
      await threadExists(parseInt(threadId), req);

      // Get thread
      const thread = await req.models.Thread.findOne({
        where: {
          threadID: threadId,
          userID,
        },
      });

      // If the thread does not exists or not owned by user
      if (!thread) {
        return res
          .status(404)
          .json({ error: "Thread not found or unauthorized" });
      }

      // Delete thread
      await thread.destroy();

      res.json({
        message: "Thread and its child threads deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete thread" });
    }
  },
);

router.get(
  "/:reviewId/threads",
  [param("reviewId").isInt().withMessage("Review ID must be an integer")],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reviewId } = req.params;

    try {
      // Get thread upto 3 levels
      const threads = await req.models.Thread.findAll({
        where: {
          reviewID: reviewId,
          parentThreadID: null, // Exclude threads that have a parent
        },
        include: [
          {
            model: req.models.Thread,
            as: "ChildThreads",
            include: [
              {
                model: req.models.Thread,
                as: "ChildThreads",
                include: [
                  {
                    model: req.models.Thread,
                    as: "ChildThreads",
                  },
                ],
              },
            ],
          },
        ],
      });

      const formatThreads = (threads: any[]): any[] => {
        return threads.map((thread) => ({
          ...thread.toJSON(),
          ChildThreads: formatThreads(thread.ChildThreads),
        }));
      };

      const formattedThreads = formatThreads(threads);

      res.json(formattedThreads);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve threads" });
    }
  },
);

export default router;
