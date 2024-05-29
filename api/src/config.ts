import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
export const PORT = process.env.PORT || 8080;
