// cart.routes.ts
import express from "express";
import { validateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Middleware to check if the user is authenticated
router.use(validateToken);

// Get the user's cart
router.get("/", async (req, res) => {
  try {
    const userId = req.user;

    const user = await req.models.User.findOne({
      where: { id: userId },
      include: {
        model: req.models.CartItem,
        include: {
          // @ts-ignore
          model: req.models.Product,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // @ts-ignore
    res.json(user.CartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the cart" });
  }
});

// Add a product to the cart
router.post("/", async (req, res) => {
  try {
    const userId = req.user;
    const { productId, quantity } = req.body;

    // Validate input data
    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await req.models.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await req.models.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [cartItem, created] = await req.models.CartItem.findOrCreate({
      // @ts-ignore
      where: { UserId: userId, ProductId: productId },
      defaults: { quantity },
    });

    if (!created) {
      cartItem.setDataValue(
        "quantity",
        cartItem.dataValues.quantity + parseInt(quantity),
      );
      await cartItem.save();
    }

    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({
      error: "An error occurred while adding the product to the cart",
    });
  }
});

// Update the quantity of a product in the cart
router.put("/:productId", async (req, res) => {
  try {
    const userId = req.user;
    const productId = req.params.productId;
    const { quantity } = req.body;

    // Validate input data
    if (quantity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await req.models.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = await req.models.CartItem.findOne({
      // @ts-ignore
      where: { UserId: userId, ProductId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cartItem.setDataValue("quantity", quantity);
    await cartItem.save();

    res.json({ message: "Cart item quantity updated successfully" });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({
      error: "An error occurred while updating the cart item quantity",
    });
  }
});

// Remove a product from the cart
router.delete("/:productId", async (req, res) => {
  try {
    const userId = req.user;
    const productId = req.params.productId;

    const user = await req.models.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = await req.models.CartItem.findOne({
      // @ts-ignore
      where: { UserId: userId, ProductId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    await cartItem.destroy();

    res.json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({
      error: "An error occurred while removing the product from the cart",
    });
  }
});

export default router;
