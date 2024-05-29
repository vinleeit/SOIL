import { initModels, Models } from "../../entities";

export {};

declare global {
  namespace Express {
    export interface Request {
      models: Models;
      user: string;
    }
  }
}
