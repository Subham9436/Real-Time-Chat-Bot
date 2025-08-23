"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCheck = exports.UserCheck = void 0;
const zod_1 = __importDefault(require("zod"));
exports.UserCheck = zod_1.default.object({
    username: zod_1.default.email(),
    password: zod_1.default.string(),
    fname: zod_1.default.string(),
    lname: zod_1.default.string(),
});
exports.MessageCheck = zod_1.default.object({
    text: zod_1.default.string(),
});
