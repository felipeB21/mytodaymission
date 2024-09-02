import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../src/db/connect.js";

// routes
import authRoute from "../src/routes/auth.route.js";
import userRoute from "../src/routes/users.route.js";
import postRoute from "../src/routes/post.route.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// api
const API = "/api";

app.use(`${API}/auth`, authRoute);
app.use(`${API}/users`, userRoute);
app.use(`${API}/post`, postRoute);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Open server http://localhost:${PORT}`);
});
