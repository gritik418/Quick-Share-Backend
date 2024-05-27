import express from "express";
import {
  downloadFile,
  findFile,
  uploadFile,
} from "../controllers/fileController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/upload", authenticate, uploadFile);

router.post("/find", authenticate, findFile);

router.get("/download/:secretKey/:originalName", authenticate, downloadFile);

export default router;
