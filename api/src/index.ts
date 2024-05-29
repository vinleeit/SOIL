import express from "express";
import { sequelize, initModels } from "./entities";
import { modelInjectionMiddleware } from "./middleware/modelInjectionMiddleware";
import authRouter from "./routes/auth.ts";

// TODO: add er digram to repo
const app = express();
app.use(express.json());

// Inject the orm models to all request
const models = initModels();
app.use(modelInjectionMiddleware(models));

const port = 8080;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.get("/ping", (_req, res) => {
      res.send("Soil server");
    });

    app.use("/auth", authRouter);

    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
