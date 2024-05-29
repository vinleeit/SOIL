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
    const product = await req.models.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
});

export default router;
