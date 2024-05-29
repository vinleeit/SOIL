import express from "express";
import { sequelize, initModels } from "./entities";
import { modelInjectionMiddleware } from "./middleware/modelInjectionMiddleware";
import authRouter from "./routes/auth.ts";
import profileRouter from "./routes/profile.ts";
import dotenv from "dotenv";
import { PORT } from "./config.ts";

// TODO: add er digram to repo

// Initialize dotenv file
dotenv.config();

const app = express();
app.use(express.json());

// Inject the orm models to all request
const models = initModels();
app.use(modelInjectionMiddleware(models));

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.get("/ping", (_req, res) => {
      res.send("Soil server");
    });

    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);

    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
