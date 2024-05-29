import type { RequestHandler } from "express";
import { type Models } from "../entities";

export const modelInjectionMiddleware = (models: Models): RequestHandler => {
  return (req, res, next) => {
    req.models = models;
    next();
  };
};
