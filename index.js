import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./database/database.js";
import cookieParser from "cookie-parser";
import { errorMiddlewares } from "./middlewares/error.js";
import userRouter from "./routes/user.js";
dotenv.config({
  path: "./database/config.env",
});
import cors from "cors";
connectdb();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// using routes
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res, send("Nice Wroking");
});

app.listen(process.env.PORT, () => {
  console.log(`Servere is runnning on port ${process.env.PORT}`);
});

app.use(errorMiddlewares);
