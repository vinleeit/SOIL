import express from "express";
import { validateToken } from "../middleware/authMiddleware";
import { normalizeInput } from "../utils";
import validator from "validator";
import bcrypt from "bcrypt";

const router = express.Router();

// Make sure the user is authenticated
router.use(validateToken);

// Get profile data
router.get("/", async (req, res) => {
  try {
    const user = await req.models.User.findOne({
      where: { id: req.user },
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

    // find the user
    const currentUser = await req.models.User.findOne({
      where: { id: userId },
    });

    // Normalize input
    const normalizedEmail = normalizeInput(email);
    const normalizedUsername = normalizeInput(username);

    // if the username and the email is the same
    if (
      normalizedUsername == currentUser?.getDataValue("username") &&
      normalizedEmail == currentUser.getDataValue("email")
    ) {
      return res.sendStatus(304);
    }
    // username too short
    if (normalizedUsername.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long" });
    }
    // Check if email is valid
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    // Check if email or username already exists
    const existingUser = await req.models.User.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser && existingUser.getDataValue("id") !== parseInt(userId)) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const existingUsername = await req.models.User.findOne({
      where: { username: normalizedUsername },
    });
    if (
      existingUsername &&
      existingUsername.getDataValue("id") !== parseInt(userId)
    ) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Update the user's profile
    if (currentUser == null) {
      return res.status(404).send("User not found");
    }
    await req.models.User.update(
      { email: normalizedEmail, username: normalizedUsername },
      { where: { id: userId }, returning: true },
    );

    res.sendStatus(200);
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
    const userID = req.user;

    // Delete the user
    const deletedRows = await req.models.User.destroy({
      where: { id: userID },
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

//change password
router.put("/password", async (req, res) => {
  const userId = req.user;
  const { oldPassword, password } = req.body;

  const currentUser = await req.models.User.findOne({ where: { id: userId } });
  if (!currentUser) {
    return res.status(404).json({ message: "User not found" });
  }
  // Check old password
  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    currentUser.dataValues.password,
  );
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Wrong old password" });
  }

  // Check password
  const strongPasswordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one symbol",
    });
  }
  // Change password
  const hashedPassword = await bcrypt.hash(password, 10);
  currentUser.setDataValue("password", hashedPassword);
  await currentUser.save();

  res.sendStatus(200);
});

export default router;
