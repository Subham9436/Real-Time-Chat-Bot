import { NextFunction, Request, Response } from "express";
import { Decode, Verify } from "../jwt";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();
export async function Authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string = req.cookies.cookie; //using cookie-parser
  //const token=auth && auth.trim("")[1]
  try {
    if (!token) {
      console.log("NO Token Detected");
      return res.status(404).json("Unauthorized:No Token Found");
    }
    if (!Verify(token)) {
      console.log("Invalid Token");
      return res.status(500).json("Invalid Token");
    }
    const decoded = Decode(token);
    if (!decoded?.username) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        fname: true,
        lname: true,
        profilepic: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.Users = user;

    next();
  } catch (err) {
    console.log("Error in the authentication of Token", err);
    throw err;
  }
}
