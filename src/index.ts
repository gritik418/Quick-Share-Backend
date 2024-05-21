import express from "express";
import connectToDB from "./database/mongoose.config.js";

const app = express();
connectToDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App listening at: ${PORT}`);
});
