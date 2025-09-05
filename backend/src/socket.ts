import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);
export const socketServer = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const userSocketMap: Record<string, string> = {};
export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

socketServer.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (typeof userId === "string") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send events to all the connected clients
  socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (typeof userId === "string") {
      delete userSocketMap[userId];
    }
    socketServer.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
