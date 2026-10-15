import express from "express";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import authRoute from "./route/authRoutes.js";
import postRoute from "./route/postRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

const PORT = process.env.PORT;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port:${PORT}`);
  });
});
