import express from "express";
import jwt from "jsonwebtoken";
import { validateToken } from "../middleware/authMiddleware";
import { normalizeInput } from "../utils";
import { JWT_SECRET } from "../config";

const router = express.Router();

// Make sure the user is authenticated
router.use(validateToken);

// Get profile data
router.get("/", async (req, res) => {
  try {
    const user = await req.models.User.findOne({
      where: { email: req.user },
      attributes: ["email", "username", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the profile" });
  }
});

// Edit profile
router.post("/", async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = req.user;
    // Validate input
    if (!email || !username) {
      return res
        .status(400)
        .json({ error: "Both email and username are required" });
    }

    // Normalize input
    const normalizedEmail = normalizeInput(email);
    const normalizedUsername = normalizeInput(username);

    // Check if email or username already exists
    const existingUser = await req.models.User.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser && existingUser.email !== userId) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const existingUsername = await req.models.User.findOne({
      where: { username: normalizedUsername },
    });
    if (existingUsername && existingUsername.email !== userId) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Update the user's profile
    // find the user and update the fields
    //
    const currentUser = await req.models.User.findOne({
      where: { email: userId },
    });

    if (currentUser == null) {
      return res.status(404).send("User not found");
    }
    await req.models.User.update(
      { email: normalizedEmail, username: normalizedUsername },
      { where: { email: userId }, returning: true },
    );

    // Generate a JWT token
    const token = jwt.sign({ user: normalizedEmail }, JWT_SECRET, {
      expiresIn: "10d",
    });

    // If the user is valid, return a success message
    res.json({ token });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
});

// Delete profile
router.delete("/", async (req, res) => {
  try {
    const email = req.user;

    // Delete the user
    const deletedRows = await req.models.User.destroy({
      where: { email: email },
    });

    if (deletedRows) {
      res.json({ message: "Profile deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the profile" });
  }
});

export default router;
