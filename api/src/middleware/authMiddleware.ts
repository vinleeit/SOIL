import { type RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, PORT } from "../config";

// Middleware to validate JWT token
export const validateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Get the token separated from the "bearer" keyword
  const [bearer, token] = authHeader.split(" ");

  // Validate if the token exits and it is a bearer token
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  try {
    // Decode the jwt token
    const decoded = jwt.verify(token, JWT_SECRET); // Set the user id as req payload on each authenticated request
    req.user = (decoded as any).user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
