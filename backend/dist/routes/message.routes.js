"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const prisma_1 = require("../../generated/prisma");
const cloudinary_1 = require("cloudinary");
exports.messageRoutes = (0, express_1.Router)();
const prisma = new prisma_1.PrismaClient();
exports.messageRoutes.get("/users", auth_1.Authenticate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loggedInUser = req.Users;
            if (!loggedInUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const filteredUsers = yield prisma.users.findMany({});
            const withoutloggedinUser = filteredUsers.filter((e) => e.id !== loggedInUser.id);
            res.status(200).json(withoutloggedinUser);
        }
        catch (err) {
            console.log("Error getting the users for SideBar", err);
            res.status(500).json("Internal Server Error");
        }
    });
});
exports.messageRoutes.get("/:id", auth_1.Authenticate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const OtherPersonId = parseInt(req.params.id, 10);
            const myId = (_a = req.Users) === null || _a === void 0 ? void 0 : _a.id;
            const messages = yield prisma.messages.findMany({
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
        }
        catch (err) {
            console.log("Error Retrieving Messages", err);
            res.status(500).json("Internal Server Error");
        }
    });
});
exports.messageRoutes.post("/send/:id", auth_1.Authenticate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { text, image } = req.body;
            const receiversId = parseInt(req.params.id, 10);
            const sendersId = (_a = req.Users) === null || _a === void 0 ? void 0 : _a.id;
            if (!sendersId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            let imageURL;
            if (image) {
                //Upload base64 image to cloudinary
                const uploadPic = yield cloudinary_1.v2.uploader.upload(image);
                // Extract the URL from the upload response
                imageURL = uploadPic.secure_url; // Use secure_url for HTTPS
            }
            const newMessages = yield prisma.messages.create({
                data: {
                    Text: text,
                    sendersId: sendersId,
                    ReceiversId: receiversId,
                    Image: imageURL,
                },
                select: {
                    id: true,
                    sendersId: true,
                    ReceiversId: true,
                    Text: true,
                    Image: true,
                    createdAT: true,
                },
            });
            //Real-time functionality goes here =>Socket.io
            res.status(201).json(newMessages);
        }
        catch (err) {
            console.log("error sending messages", err);
            res.status(500).json("Internal Server Error");
        }
    });
});
