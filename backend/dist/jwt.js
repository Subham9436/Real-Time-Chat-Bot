"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignJWT = SignJWT;
exports.Verify = Verify;
exports.Decode = Decode;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWTPass = process.env.JWTPass || "";
function SignJWT(username, id, res) {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            return null;
        }
        const payLoad = { username, id };
        const token = jsonwebtoken_1.default.sign(payLoad, JWTPass, { expiresIn: "7d" });
        res.cookie("cookie", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //Miliseconds,
            httpOnly: true, //prevents cross-site XSS scripting attacks
            sameSite: "strict", // prevents CSRF attacks cross-site forgery attacks
        });
    }
    catch (error) {
        console.log("error generating token", error);
        throw error;
    }
}
function Verify(token) {
    try {
        jsonwebtoken_1.default.verify(token, JWTPass);
        return true;
    }
    catch (err) {
        console.log("Error Verifying Token", err);
        throw err;
    }
}
function Decode(token) {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || typeof decoded === "string") {
            return null;
        }
        return decoded;
    }
    catch (err) {
        console.log("error decoding token", err);
        return null;
    }
}
