import dotenv from "dotenv";

// Configure dotenv, to allow saving local config in .env file
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
export const PORT = process.env.PORT || 8080;
