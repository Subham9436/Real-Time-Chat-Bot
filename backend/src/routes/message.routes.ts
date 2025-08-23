import { Router } from "express";
import { Authenticate } from "../middlewares/auth";
import { PrismaClient } from "../../generated/prisma";
import { v2 as cloudinary } from "cloudinary";
export const messageRoutes = Router();

interface Image {
  image: string;
}
const prisma = new PrismaClient();
messageRoutes.get("/users", Authenticate, async function (req, res) {
  try {
    const loggedInUser = req.Users;
    if (!loggedInUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const filteredUsers = await prisma.users.findMany({});
    const withoutloggedinUser = filteredUsers.filter(
      (e) => e.id !== loggedInUser.id
    );
    res.status(200).json(withoutloggedinUser);
  } catch (err) {
    console.log("Error getting the users for SideBar", err);
    res.status(500).json("Internal Server Error");
  }
});
messageRoutes.get("/:id", Authenticate, async function (req, res) {
  try {
    const OtherPersonId = parseInt(req.params.id, 10);
    const myId = req.Users?.id;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            sendersId: myId,
            ReceiversId: OtherPersonId,
          },
          {
            sendersId: OtherPersonId,
            ReceiversId: myId,
          },
        ],
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log("Error Retrieving Messages", err);
    res.status(500).json("Internal Server Error");
  }
});
messageRoutes.post("/send/:id", Authenticate, async function (req, res) {
  try {
    const { text, image } = req.body;
    const receiversId = parseInt(req.params.id, 10);
    const sendersId = req.Users?.id;
    if (!sendersId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let imageURL;
    if (image) {
      //Upload base64 image to cloudinary
      const uploadPic = await cloudinary.uploader.upload(image);
      // Extract the URL from the upload response
      imageURL = uploadPic.secure_url; // Use secure_url for HTTPS
    }
    const newMessages = await prisma.messages.create({
      data: {
        Text: text,
        sendersId: sendersId,
        ReceiversId: receiversId,
        Image: imageURL,
      },
    });
    //Real-time functionality goes here =>Socket.io
    res.status(200).json(newMessages);
  } catch (err) {
    console.log("error sending messages", err);
    res.status(500).json("Internal Server Error");
  }
});
