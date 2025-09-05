"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_routes_1 = require("./routes/userRoutes.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const message_routes_1 = require("./routes/message.routes");
const socket_1 = require("./socket");
dotenv_1.default.config();
const port = 5000;
socket_1.app.use(express_1.default.json({ limit: "10mb" }));
socket_1.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
socket_1.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use("/api/v1/user", userRoutes_routes_1.userRoutes);
socket_1.app.use("/api/v1/messages", message_routes_1.messageRoutes);
socket_1.server.listen(port, () => {
    console.log(`The port is running on ${port}`);
});
