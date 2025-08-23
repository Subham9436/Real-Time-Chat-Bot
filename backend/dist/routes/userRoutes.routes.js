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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const types_1 = require("../types");
const auth_1 = require("../middlewares/auth");
const jwt_1 = require("../jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("../cloudinary"));
const prisma = new prisma_1.PrismaClient();
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.get("/check", auth_1.Authenticate, function (req, res) {
    try {
        res.status(200).json(req.Users);
    }
    catch (error) {
        console.log("error in checkAuth middleware", error);
        return res.status(500).json("Internal Server Error");
    }
});
exports.userRoutes.post("/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, fname, lname } = req.body;
        const parsedPayload = types_1.UserCheck.safeParse({
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
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const NewUser = yield prisma.users.create({
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
        const token = (0, jwt_1.SignJWT)(username, NewUser.id, res);
        res.status(200).json({
            msg: "User Created Successfully",
            NewUser,
            token,
        });
    });
});
exports.userRoutes.post("/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        // const parsedPayload = UserCheck.safeParse({ username, password });
        // if (!parsedPayload.success) {
        //   console.log("Wrong Inputs");
        //   return res.status(400).json("Wrong Inputs");
        // }
        const UserExist = yield prisma.users.findUnique({
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
        const isComparePassword = yield bcrypt_1.default.compare(password, UserExist.password);
        if (!isComparePassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = (0, jwt_1.SignJWT)(UserExist === null || UserExist === void 0 ? void 0 : UserExist.username, UserExist.id, res);
        res.status(200).json({
            msg: "Sign-in Successfull",
            token,
            UserExist,
        });
    });
});
exports.userRoutes.post("/logout", function (req, res) {
    try {
        res.cookie("cookie", " ", { maxAge: 0 });
        res.json("Logout Successfully");
    }
    catch (error) {
        console.log("Logout at controller", error);
        throw error;
    }
});
exports.userRoutes.put("/updateProfilePic", auth_1.Authenticate, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { profilepic } = req.body;
            const user = req.Users;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            console.log("User type", user);
            const uploadPic = yield cloudinary_1.default.uploader.upload(profilepic);
            // Extract the URL from the upload response
            const profilePicUrl = uploadPic.secure_url; // Use secure_url for HTTPS
            const updatePic = yield prisma.users.updateManyAndReturn({
                where: { id: user.id },
                data: { profilepic: profilePicUrl },
            });
            res.status(200).json(updatePic);
        }
        catch (err) {
            console.log("error updating profilePic", err);
            return res.status(500).json("Internal Server Error");
        }
    });
});
