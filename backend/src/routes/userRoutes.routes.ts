import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";
import { UserCheck } from "../types";
import { Authenticate } from "../middlewares/auth";
import { SignJWT } from "../jwt";
import bcrypt from "bcrypt";
import cloudinary from "../cloudinary";

const prisma = new PrismaClient();
export const userRoutes = Router();

interface User {
  username: string;
  password: string;
  fname: string;
  lname: string;
  profilepic: string;
}

userRoutes.get("/check", Authenticate, function (req, res) {
  try {
    res.status(200).json(req.Users);
  } catch (error) {
    console.log("error in checkAuth middleware", error);
    return res.status(500).json("Internal Server Error");
  }
});

userRoutes.post("/signup", async function (req, res) {
  const { username, password, fname, lname }: User = req.body;
  const parsedPayload = UserCheck.safeParse({
    username,
    password,
    fname,
    lname,
  });
  if (!parsedPayload.success) {
    console.log("Wrong Inputs");
    res.status(500).json("Wrong Inputs");
  }
  if (password.length < 6) {
    res.status(400).json("Password Must Be More than 6 characters");
    return null;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const NewUser = await prisma.users.create({
    data: {
      username,
      password: hashedPassword,
      fname,
      lname,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
    },
  });
  const token = SignJWT(username, NewUser.id, res);
  res.status(200).json({
    msg: "User Created Successfully",
    NewUser,
    token,
  });
});

userRoutes.post("/signin", async function (req, res) {
  const { username, password }: User = req.body;
  // const parsedPayload = UserCheck.safeParse({ username, password });
  // if (!parsedPayload.success) {
  //   console.log("Wrong Inputs");
  //   return res.status(400).json("Wrong Inputs");
  // }
  const UserExist = await prisma.users.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });
  console.log(UserExist);
  // Check if user exists(Crucial For Token Generation)
  if (!UserExist || !UserExist.username) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  //Compare Hashed Password
  const isComparePassword = await bcrypt.compare(password, UserExist.password);
  if (!isComparePassword) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = SignJWT(UserExist?.username, UserExist.id, res);

  res.status(200).json({
    msg: "Sign-in Successfull",
    token,
    UserExist,
  });
});
userRoutes.post("/logout", function (req, res) {
  try {
    res.cookie("cookie", " ", { maxAge: 0 });
    res.json("Logout Successfully");
  } catch (error) {
    console.log("Logout at controller", error);
    throw error;
  }
});

userRoutes.put("/updateProfilePic", Authenticate, async function (req, res) {
  try {
    const { profilepic }: User = req.body;
    const user = req.Users;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("User type", user);
    const uploadPic = await cloudinary.uploader.upload(profilepic);
    // Extract the URL from the upload response
    const profilePicUrl = uploadPic.secure_url; // Use secure_url for HTTPS
    const updatePic = await prisma.users.updateManyAndReturn({
      where: { id: user.id },
      data: { profilepic: profilePicUrl },
    });
    res.status(200).json(updatePic);
  } catch (err) {
    console.log("error updating profilePic", err);
    return res.status(500).json("Internal Server Error");
  }
});
