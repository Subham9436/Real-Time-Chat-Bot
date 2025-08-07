import { User } from "../../generated/prisma/index.js";

declare global {
  namespace Express {
    interface Request {
      Users?: Pick<User, "id" | "username">; 
    }
  }
}