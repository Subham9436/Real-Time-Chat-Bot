import type { NextFunction, Request, Response } from "express";
import { Decode, Verify } from "../jwt.js";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();
export async function Authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string = req.cookies.Bearer;
    if (!token) {
      console.log("NO Token Detected");
      return res.status(404).json("Unauthorized:No Token Found");
    }
    if (!Verify(token)) {
      console.log("Invalid Token");
      return res.status(500).json("Invalid Token");
    }
    const decode = Decode(token);
    if (!decode?.id) {
      console.log("NO Token Detected");
      return res.status(404).json("Unauthorized:No TokenID Found");
    }
    const decodedUser = await prisma.user.findUnique({
      where: { id: decode.id },
      select: {
        id: true,
        username: true,
      },
    });
    if (!decodedUser) {
      return res.status(401).json({ message: "User not found" });
    }
    req.Users = decodedUser;
    return next();
  } catch (err) {
    console.log("Error authenticating", err);
    throw err
  }
}
