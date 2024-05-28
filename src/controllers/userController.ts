import { Request, Response } from "express";
import LoginSchema, { LoginSchemaType } from "../validators/loginSchema.js";
import vine, { errors } from "@vinejs/vine";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  UserLoginDataType,
  UserSignupDataType,
  VerifyEmailDataType,
} from "../types/index.js";
import SignupSchema, { SignupSchemaType } from "../validators/signupSchema.js";
import Verification from "../models/verificationModel.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail, { MailOptionsType } from "../utils/sendEmail.js";
import verificationTemplate from "../utils/verificationTemplate.js";
import { ErrorReporter } from "../validators/ErrorReporter.js";
import EmailVerificationSchema, {
  EmailVerificationType,
} from "../validators/emailVerificationSchema.js";

vine.errorReporter = () => new ErrorReporter();

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select({
      first_name: 1,
      last_name: 1,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Please Login.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};

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

    res.cookie("token", token, {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully.",
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        success: false,
        status: 400,
        errors: error.messages,
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
    const data: UserSignupDataType = req.body;
    const output: SignupSchemaType = await vine.validate({
      schema: SignupSchema,
      data,
    });

    const checkExisting = await User.findOne({ email: output.email });
    if (checkExisting) {
      if (checkExisting.email_verified) {
        return res.status(401).json({
          success: false,
          status: 400,
          message: "Account already exists.",
        });
      } else {
        await User.findOneAndDelete({ email: output.email });
      }
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

    await sendEmail(mailOptions);

    return res.status(201).json({
      success: true,
      status: 200,
      message: "Mail sent.",
      email: output.email,
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        success: false,
        status: 400,
        errors: error.messages,
      });
    }
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data: VerifyEmailDataType = req.body;
    const output: EmailVerificationType = await vine.validate({
      schema: EmailVerificationSchema,
      data,
    });

    const user = await User.findOne({
      email: output.email,
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Invalid Request.",
      });
    }

    const verificationToken = await Verification.findOne({ userId: user._id });
    if (!verificationToken) {
      await User.findOneAndDelete({ email: output.email });
      return res.status(401).json({
        success: false,
        status: 400,
        message: "OTP Expired.",
      });
    }

    const verify = await bcrypt.compare(
      output.secretKey,
      verificationToken.secretKey
    );
    if (!verify) {
      await User.findOneAndDelete({ email: output.email });
      return res.status(401).json({
        success: false,
        status: 400,
        message: "Invalid OTP.",
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $set: { email_verified: true },
    });

    const token: string = await user.generateAuthToken({
      id: user._id,
      email: user.email,
    });

    res.cookie("token", token, {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Account created Successfully.",
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        success: false,
        status: 400,
        errors: error.messages,
      });
    }
    return res.status(500).json({
      success: false,
      status: 400,
      message: "Server Error.",
    });
  }
};
