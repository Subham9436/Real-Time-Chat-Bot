import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes.routes";
import cookieParser from "cookie-parser";
import { messageRoutes } from "./routes/message.routes";

dotenv.config();
const app = express();
const port = 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/messages", messageRoutes);

app.listen(port, () => {
  console.log(`The port is running on ${port}`);
});
