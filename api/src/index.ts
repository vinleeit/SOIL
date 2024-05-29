import express from "express";
import { sequelize, initModels } from "./entities";

const app = express();
const port = 8080;
const models = initModels();

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.get("/", (_req, res) => {
      res.send("Hello");
    });

    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
