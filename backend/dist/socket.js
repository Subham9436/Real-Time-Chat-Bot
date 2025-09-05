"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = exports.server = exports.app = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.socketServer = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
const userSocketMap = {};
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
exports.socketServer.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (typeof userId === "string") {
        userSocketMap[userId] = socket.id;
    }
    // io.emit() is used to send events to all the connected clients
    exports.socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        if (typeof userId === "string") {
            delete userSocketMap[userId];
        }
        exports.socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
