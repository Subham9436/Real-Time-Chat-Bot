import { Users } from "../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      Users?: Pick<Users, "id" | "username" |"fname"|"lname">; 
    }
  }
}
