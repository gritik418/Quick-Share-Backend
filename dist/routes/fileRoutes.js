import express from "express";
import { findFile, uploadFile } from "../controllers/fileController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();
router.post("/upload", authenticate, uploadFile);
router.get("/find", authenticate, findFile);
export default router;
//# sourceMappingURL=fileRoutes.js.map