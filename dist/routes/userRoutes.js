import express from "express";
import { getUser, userLogin, userSignup, verifyEmail, } from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();
router.get("/", authenticate, getUser);
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/verify", verifyEmail);
export default router;
//# sourceMappingURL=userRoutes.js.map