// product.routes.ts
import express from "express";
import { validateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Create a new product
router.post("/", validateToken, async (req, res) => {
  try {
    const { name, description, price, imageURL, discountAmount } = req.body;

    // Validate input data
    if (
      !name ||
      !description ||
      !price ||
      !imageURL ||
      discountAmount === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await req.models.Product.create({
      name,
      description,
      price,
      imageURL,
      discountAmount,
    });

    res.sendStatus(201);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await req.models.Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the products" });
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await req.models.Product.findByPk(req.params.id, {
      include: [
        {
          model: req.models.Review,
          include: [
            {
              model: req.models.User,
              attributes: ["id", "username"], // Include both id and username fields
            },
            {
              model: req.models.Thread,
              where: {
                parentThreadID: null, // Exclude threads that have a parent
              },
              required: false, // Allow reviews without associated threads
              include: [
                {
                  model: req.models.User,
                  attributes: ["id", "username"], // Include both id and username fields
                },
                {
                  model: req.models.Thread,
                  as: "ChildThreads",
                  include: [
                    {
                      model: req.models.User,
                      attributes: ["id", "username"], // Include both id and username fields
                    },
                    {
                      model: req.models.Thread,
                      as: "ChildThreads",
                      include: [
                        {
                          model: req.models.User,
                          attributes: ["id", "username"], // Include both id and username fields
                        },
                        {
                          model: req.models.Thread,
                          as: "ChildThreads",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    //@ts-ignore
    const formatThreads = (threads) => {
      //@ts-ignore
      return threads.map((thread) => ({
        ...thread.toJSON(),
        content: thread.dataValues.isBlocked
          ? "[**** This review has been deleted by the admin ***]"
          : thread.dataValues.content,
        User: thread.User ? thread.User.toJSON() : null,
        ChildThreads: formatThreads(thread.ChildThreads),
      }));
    };

    const formattedProduct = {
      ...product.toJSON(),
      //@ts-ignore
      Reviews: product.Reviews.map((review) => {
        return {
          ...review.toJSON(),
          review: review.dataValues.isBlocked
            ? "[**** This review has been deleted by the admin ***]"
            : review.dataValues.review,
          User: review.User ? review.User.toJSON() : null,
          Threads: review.Threads ? formatThreads(review.Threads) : [],
        };
      }),
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
});
export default router;
