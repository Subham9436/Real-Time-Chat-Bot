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
exports.Authenticate = Authenticate;
const jwt_1 = require("../jwt");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function Authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.cookie; //using cookie-parser
        //const token=auth && auth.trim("")[1]
        try {
            if (!token) {
                console.log("NO Token Detected");
                return res.status(404).json("Unauthorized:No Token Found");
            }
            if (!(0, jwt_1.Verify)(token)) {
                console.log("Invalid Token");
                return res.status(500).json("Invalid Token");
            }
            const decoded = (0, jwt_1.Decode)(token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.username)) {
                return res.status(400).json({ message: "Invalid token payload" });
            }
            const user = yield prisma.users.findUnique({
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
        }
        catch (err) {
            console.log("Error in the authentication of Token", err);
            throw err;
        }
    });
}
