import type { RequestHandler } from "express";
import { type Models } from "../entities";

// Inject database model to each and every req
export const modelInjectionMiddleware = (models: Models): RequestHandler => {
  return (req, res, next) => {
    req.models = models;
    next();
  };
};
