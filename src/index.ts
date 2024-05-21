import express from "express";
import connectToDB from "./database/mongoose.config.js";
import fileRouter from "./routes/fileRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
connectToDB();

const PORT = process.env.PORT || 8000;

app.use("/api/file", fileRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`App listening at: ${PORT}`);
});
