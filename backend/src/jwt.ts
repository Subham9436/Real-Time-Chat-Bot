import { Response } from "express";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "./jwtpayload";

const JWTPass: string = process.env.JWTPass || "";

export function SignJWT(username: string, id: number, res: Response) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return null;
    }
    const payLoad = { username, id };
    const token = jwt.sign(payLoad, JWTPass, { expiresIn: "7d" });
    res.cookie("cookie", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //Miliseconds,
      httpOnly: true, //prevents cross-site XSS scripting attacks
      sameSite: "strict", // prevents CSRF attacks cross-site forgery attacks
    });
  } catch (error) {
    console.log("error generating token", error);
    throw error;
  }
}

export function Verify(token: string) {
  try {
    jwt.verify(token, JWTPass);
    return true;
  } catch (err) {
    console.log("Error Verifying Token", err);
    throw err;
  }
}

export function Decode(token: string): MyJwtPayload | null {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === "string") {
      return null;
    }

    return decoded as MyJwtPayload;
  } catch (err) {
    console.log("error decoding token", err);
    return null;
  }
}
