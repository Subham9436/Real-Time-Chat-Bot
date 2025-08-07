import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { MyJwtPayload } from "./jwtpayload.js";
const JWTPass: string = process.env.JWTPASS || "";

export function SignJwt(username: string, id: number, res: Response) {
  try {
    const isemailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isemailRegex.test(username)) {
      return null;
    }
    const payload = { username, id };
    const token = jwt.sign(payload, JWTPass, { expiresIn: "7d" });
    res.cookie("Bearer", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
  } catch (err) {
    console.log("Error generating token", err);
    res.status(500).json("Internal server error");
  }
}
export function Verify(token: string) {
  try {
    jwt.verify(token, JWTPass);
    return true;
  } catch (err) {
    console.log("Error verifying token", err);
    throw err;
  }
}
export function Decode(token: string): MyJwtPayload | null {
  try {
    const decode = jwt.decode(token);
    if (!decode || typeof decode === "string") {
      return null;
    }
    return decode as MyJwtPayload;
  } catch (err) {
    console.log("Error decoding token", err);
    throw err;
  }
}
