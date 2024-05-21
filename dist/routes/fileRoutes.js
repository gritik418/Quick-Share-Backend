import express from "express";
import { uploadFile } from "../controllers/fileController.js";
const router = express.Router();
router.post("/upload", uploadFile);
export default router;
//# sourceMappingURL=fileRoutes.js.map