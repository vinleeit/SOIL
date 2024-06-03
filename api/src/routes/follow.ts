import express from "express";
import { validateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Middleware to check if the user is authenticated
router.use(validateToken);

// Get all followed users
router.get("/", async (req, res) => {
  try {
    const followerId = req.user;

    // Fetch the UserFollow records where followerId matches the authenticated user
    const followingRecords = await req.models.UserFollow.findAll({
      where: { followerId },
      attributes: ["followingId"], // Only fetch the followingId column
    });

    // Extract the followingId values from the fetched records
    const followingIds = followingRecords.map(
      (record) => record.dataValues.followingId,
    );

    // Fetch the User records whose id is in the followingIds array
    const followedUsers = await req.models.User.findAll({
      where: { id: followingIds },
      attributes: {
        exclude: ["createdAt", "updatedAt", "isBlocked", "password"],
      },
    });

    res.json(followedUsers);
  } catch (error) {
    console.error("Error getting followed users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while getting followed users" });
  }
});

// Follow a user
router.post("/:followingId", async (req, res) => {
  const followingId = req.params.followingId;

  // Check if followingId is empty
  if (!followingId) {
    return res.status(400).json({ error: "followingId is required" });
  }

  // Check if followingId is a valid number
  if (isNaN(parseInt(followingId))) {
    return res.status(400).json({ error: "followingId must be a number" });
  }
  try {
    const followerId = parseInt(req.user, 10);
    const followingId = parseInt(req.params.followingId, 10);

    // Check if the user is trying to follow themselves
    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const follower = await req.models.User.findByPk(followerId);
    const following = await req.models.User.findByPk(followingId);

    if (!follower || !following) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingFollow = await req.models.UserFollow.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return res
        .status(409)
        .json({ error: "You are already following this user" });
    }
    await req.models.UserFollow.create({
      followerId,
      followingId,
    });

    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while following the user" });
  }
});

// Unfollow a user
router.delete("/:followingId", async (req, res) => {
  const followingId = req.params.followingId;

  // Check if followingId is empty
  if (!followingId) {
    return res.status(400).json({ error: "followingId is required" });
  }

  // Check if followingId is a valid number
  if (isNaN(parseInt(followingId))) {
    return res.status(400).json({ error: "followingId must be a number" });
  }
  try {
    const followerId = parseInt(req.user, 10);
    const followingId = parseInt(req.params.followingId, 10);

    const existingFollow = await req.models.UserFollow.findOne({
      where: { followerId, followingId },
    });

    if (!existingFollow) {
      return res.status(404).json({ error: "You are not following this user" });
    }

    await existingFollow.destroy();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while unfollowing the user" });
  }
});

export default router;
