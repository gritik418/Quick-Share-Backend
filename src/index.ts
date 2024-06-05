import express from "express";
import connectToDB from "./database/mongoose.config.js";
import fileRouter from "./routes/fileRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;
connectToDB();

app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    allowedHeaders: [
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Headers",
    ],
    preflightContinue: true,
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_DOMAIN!);

  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  next();
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/file", fileRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`App listening at: ${PORT}`);
});
