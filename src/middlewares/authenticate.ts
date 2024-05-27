import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenType } from "../models/userModel.js";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.cookies.token;

    if (!authToken) {
      throw new Error("Authentication failed.");
    }

    const verify: TokenType | null = jwt.verify(
      authToken,
      process.env.JWT_SECRET!
    ) as TokenType | null;

    if (!verify) {
      throw new Error("Authentication failed.");
    }

    req.params.id = verify.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      status: 400,
      message: "Please Login.",
    });
  }
};

export default authenticate;
