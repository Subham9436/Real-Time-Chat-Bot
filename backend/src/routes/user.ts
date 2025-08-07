import { Router } from "express";
import { UserCheck } from "../types.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../generated/prisma/index.js";
import { SignJwt } from "../jwt.js";
import type { User } from "../Ts-types/types.tstypes.js";
import { Authenticate } from "../middlewares/auth.js";
import { v2 as cloudinary } from "cloudinary";

export const userRoutes = Router();
const prisma = new PrismaClient();
userRoutes.get("/check", Authenticate, function (req, res) {
  try {
    const authUser = req.Users;
    res.status(200).json({
      msg: "Authenticated User",
      authUser,
    });
  } catch (err) {
    console.log("not authorized", err);
    res.status(401).json("User not Authorized");
  }
});
userRoutes.post("/signup", async function (req, res) {
  const { username, password, fname, lname, profilePic }: User = req.body;
  const parsedPayload = UserCheck.safeParse({
    username,
    password,
    fname,
    lname,
    profilePic,
  });
  if (!parsedPayload.success) {
    console.log("Wrong Inputs");
    res.status(411).json("Wrong Inputs");
  }
  if (password.length < 6) {
    console.log("Pass must be greater than 6 characters");
    res.status(411).json("Password must be greater than 6 characters");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      fname,
      lname,
      profilePic,
    },
    select: {
      id: true,
    },
  });
  const token = SignJwt(username, newUser.id, res);
  res.status(200).json({
    msg: "User Created Successfully",
    newUser,
    token,
  });
});
userRoutes.post("/signin", async function (req, res) {
  const { username, password } = req.body;
  const UserExist = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });
  if (!UserExist) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
  const comparedPassword = await bcrypt.compare(password, UserExist.password);
  if (!comparedPassword) {
    res.status(401).json({ message: "Invalid Credentials" });
  }
  const token = SignJwt(UserExist.username, UserExist.id, res);
  res.status(200).json({
    msg: "Sign-in Successfull",
    token,
    UserExist,
  });
});
userRoutes.post("/logout", function (req, res) {
  try {
    res.cookie("Bearer", " ", { maxAge: 0 });
    res.json("Logout Successfully");
  } catch (error) {
    console.log("Logout at controller", error);
    throw error;
  }
});
userRoutes.put("/updateprofile", Authenticate, async function (req, res) {
  const { profilePic } = req.body;
  const user = req.Users;
  if (!user) {
    return res.status(404).json("User Not Authorized");
  }
  const uploadPic = await cloudinary.uploader.upload(profilePic);
  const uploadURL = uploadPic.secure_url;
  const updatedProfilePic = await prisma.user.update({
    where: { id: user.id },
    data: {
      profilePic: uploadURL,
    },
  });
  res.status(200).json({
    msg: "Profile Pic Updated Successfully",
    updatedProfilePic,
  });
});
