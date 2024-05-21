import { Request, Response, json } from "express";
import LoginSchema, { LoginSchemaType } from "../validators/loginSchema.js";
import vine from "@vinejs/vine";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { UserLoginDataType } from "../types/index.js";

export const userLogin = async (req: Request, res: Response) => {
  try {
    const data: UserLoginDataType = req.body;
    const output: LoginSchemaType = await vine.validate({
      schema: LoginSchema,
      data,
    });

    const user = await User.findOne({ email: output.email });
    if (!user || !user.email_verified) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Invalid Credentials.",
      });
    }

    const verify = await bcrypt.compare(output.password, user.password);
    if (!verify) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Invalid Credentials.",
      });
    }

    const token: string = await user.generateAuthToken({
      id: user._id,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Logged In Successfully.",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};
