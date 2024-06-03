import express from "express";
import { validateToken } from "../middleware/authMiddleware";
import { User } from "../entities/User";
import axios from "axios";

const router = express.Router();

// Get review for a product
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product exists
    const product = await req.models.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Get reviews for the product
    const reviews = await req.models.Review.findAll({
      //@ts-ignore
      where: { ProductId: productId },
      include: [
        {
          model: User,
          attributes: ["id", "username"], // Include only the desired user attributes
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Add a review
router.post("/:productId", validateToken, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const userId = req.user;
    const productId = req.params.productId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Invalid rating. Rating must be between 1 and 5." });
    }

    // Validate review text
    const words = review.trim().split(/\s+/);
    if (words.length > 100) {
      return res
        .status(400)
        .json({ error: "Review must not exceed 100 words." });
    }

    // Check if the product exists
    const product = await req.models.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check if user that add the product still exists (or abaandoned token)
    const currentUser = await req.models.User.findOne({
      where: { id: userId },
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
    // According to the tutor on the discussoin, a user can leave many reviews
    // Check if the user has already left a review for this product
    // const existingReview = await req.models.Review.findOne({
    //   //@ts-ignore
    //   where: { UserId: userId, ProductId: productId },
    // });
    // if (existingReview) {
    //   return res
    //     .status(400)
    //     .json({ error: "User has already left a review for this product." });
    // }

    // Create a new review
    const newReview = await req.models.Review.create({
      rating,
      review,
      //@ts-ignore
      UserId: userId,
      ProductId: productId,
    });
    newReview.setDataValue("reviewID", newReview.reviewID);
    await axios.post("http://localhost:4000/refresh-review");
    res.status(201).json(newReview.dataValues);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Edit a review
router.put("/:id", validateToken, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const reviewId = req.params.id;
    const userId = req.user;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Invalid rating. Rating must be between 1 and 5." });
    }

    // Validate review text
    const words = review.trim().split(/\s+/);
    if (words.length > 100) {
      return res
        .status(400)
        .json({ error: "Review must not exceed 100 words." });
    }

    // Find the review by ID and user ID
    const existingReview = await req.models.Review.findOne({
      //@ts-ignore
      where: { reviewID: reviewId, UserId: userId },
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Update the review
    existingReview.setDataValue("rating", rating);
    existingReview.setDataValue("review", review);
    await existingReview.save();

    res.json(existingReview);
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Delete a review
router.delete("/:id", validateToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user;

    // Find the review by ID and user ID
    const existingReview = await req.models.Review.findOne({
      //@ts-ignore
      where: { reviewID: reviewId, UserId: userId },
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Delete the review
    await existingReview.destroy();

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
