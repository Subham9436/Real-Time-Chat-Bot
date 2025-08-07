import { Router } from "express";
import { Authenticate } from "../middlewares/auth.js";
import { PrismaClient } from "../../generated/prisma/index.js";
import cloudinary from "../cloudinary.js";
import type { Msg } from "../Ts-types/types.tstypes.js";
export const messageRoutes = Router();

const prisma = new PrismaClient();
messageRoutes.get("/users", Authenticate, async function (req, res) {
  try {
    const user = req.Users;
    if (!user) {
      return res.status(404).json("User Not Authorized");
    }
    const fetchedUser = await prisma.user.findMany({
      where: { id: user?.id },
      select: {
        username: true,
        fname: true,
        lname: true,
        profilePic: true,
      },
    });
    res.status(200).json({
      msg: "Users-Fetched Successfully",
      fetchedUser,
    });
  } catch (err) {
    console.log("Error fetching Users", err);
    res.status(500).json("Internal server Error");
  }
});
messageRoutes.get("/msg/:id", Authenticate, async function (req, res) {
  try {
    if (!req.params.id) {
      return res.status(404).json("User Not Authorized");
    }
    const otherid = parseInt(req.params.id, 10);
    const myId = req.Users?.id;
    if (!myId || otherid) {
      return res.status(404).json("User Not Authorized");
    }
    const Messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            sendersId: otherid,
            receiversId: myId,
          },
          {
            sendersId: myId,
            receiversId: otherid,
          },
        ],
      },
    });
    res.status(200).json({
      msg: "Messages Retrieved Successfully",
      Messages,
    });
  } catch (err) {}
});
messageRoutes.post("/send/:id", Authenticate, async function (req, res) {
  try {
    if (!req.params.id) {
      return res.status(404).json("User Not Authorized");
    }
    const receiversId = parseInt(req.params.id, 10);
    const { text, image }: Msg = req.body;
    const sendersId = req.Users?.id;
    let imgURL: string | null = null;
    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image);
      imgURL = uploadImg.secure_url;
    }
    if (typeof sendersId === "undefined") {
      return res.status(400).json("Sender ID is required.");
    }
    const insertMsgImg = await prisma.messages.create({
      data: {
        text,
        image: imgURL,
        sendersId,
        receiversId,
      },
    });
    res.status(201).json(insertMsgImg);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json("Failed to send message.");
  }
});
