import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/user", userRoutes);
app.listen(port, () => {
    console.log(`the port is running on ${port}`);
});
//# sourceMappingURL=index.js.map