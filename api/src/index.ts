import express from "express";
import { sequelize, initModels } from "./entities";
import { modelInjectionMiddleware } from "./middleware/modelInjectionMiddleware";
import authRouter from "./routes/auth.ts";
import profileRouter from "./routes/profile.ts";
import dotenv from "dotenv";
import { PORT } from "./config.ts";
import productRouter from "./routes/product.ts";
import followRouter from "./routes/follow.ts";
import cartRouter from "./routes/cart.ts";
import reviewRouter from "./routes/review.ts";
import threadRouter from "./routes/thread.ts";
import cors from "cors";

// Create express server with json middleware and CORS policy (allowed from everywhere)
const app = express();
app.use(express.json());
app.use(cors());

// Inject the orm models to all request
const models = initModels();
app.use(modelInjectionMiddleware(models));

(async () => {
  try {
    // Connect to server
    await sequelize.authenticate();
    // Update database
    await sequelize.sync();

    app.get("/ping", (_req, res) => {
      res.send("Soil server");
    });

    // Register all routers
    app.use("/auth", authRouter);
    app.use("/profile", profileRouter);
    app.use("/product", productRouter);
    app.use("/follow", followRouter);
    app.use("/cart", cartRouter);
    app.use("/review", reviewRouter);
    app.use("/thread", threadRouter);

    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
