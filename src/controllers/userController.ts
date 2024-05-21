import { Request, Response, json } from "express";
import LoginSchema, { LoginSchemaType } from "../validators/loginSchema.js";
import vine, { errors } from "@vinejs/vine";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { UserLoginDataType } from "../types/index.js";
import SignupSchema, { SignupSchemaType } from "../validators/signupSchema.js";
import Verification from "../models/verificationModel.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail, { MailOptionsType } from "../utils/sendEmail.js";
import verificationTemplate from "../utils/verificationTemplate.js";

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
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: error.messages,
      });
    }
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};

export const userSignup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const output: SignupSchemaType = await vine.validate({
      schema: SignupSchema,
      data,
    });

    const checkExisting = await User.findOne({ email: output.email });
    if (checkExisting && checkExisting.email_verified) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Account already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(output.password, salt);

    const user = new User({
      first_name: output.first_name,
      last_name: output.last_name,
      email: output.email,
      password: hashedPassword,
    });
    await user.save();

    const secretKey = generateOTP();

    const verification = new Verification({
      userId: user._id,
      secretKey,
    });
    await verification.save();

    const mailOptions: MailOptionsType = {
      from: "QuickShare@gmail.com",
      to: output.email,
      html: verificationTemplate(secretKey),
      subject: "Verify your Email Address",
      text: `Verify your Email Address. To verify your account use the otp : ${secretKey}`,
    };

    sendEmail(mailOptions)
      .then(() => {
        return res.status(201).json({
          success: true,
          status: 200,
          message: "Mail Sent.",
        });
      })
      .catch((err) => {
        return res.status(201).json({
          success: true,
          status: 200,
          message: err,
        });
      });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: error.messages,
      });
    }
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};
