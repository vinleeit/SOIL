import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";

const router = express.Router();

// Registration endpoint
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if all body data is present
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if username is at least 3 characters
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters long" });
    }

    // Check if password is strong enough
    const strongPasswordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one symbol",
      });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Check if email or username already exists
    const existingUser = await req.models.User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const existingUsername = await req.models.User.findOne({
      where: { username },
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await req.models.User.create({
      email,
      username,
      password: hashedPassword,
      isBlocked: false,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all body data is present
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the user by email
    const user = await req.models.User.findOne({ where: { email } });

    // If user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password,
    );

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // If the user is blocked, return an error
    if (user.isBlocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    // If the user is valid, return a success message
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

export default router;
