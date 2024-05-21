import express from "express";
import {
  userLogin,
  userSignup,
  verifyEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", userLogin);

router.post("/signup", userSignup);

router.post("/verify", verifyEmail);

export default router;
