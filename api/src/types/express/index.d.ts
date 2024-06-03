import { initModels, Models } from "../../entities";

export {};

// Type definition to allow ts to detect model and user in every request payload
declare global {
  namespace Express {
    export interface Request {
      models: Models;
      user: string;
    }
  }
}
