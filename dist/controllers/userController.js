import LoginSchema from "../validators/loginSchema.js";
import vine, { errors } from "@vinejs/vine";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import SignupSchema from "../validators/signupSchema.js";
import Verification from "../models/verificationModel.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import verificationTemplate from "../utils/verificationTemplate.js";
import { ErrorReporter } from "../validators/ErrorReporter.js";
import EmailVerificationSchema from "../validators/emailVerificationSchema.js";
vine.errorReporter = () => new ErrorReporter();
export const getUser = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            status: 400,
            message: "Server Error.",
        });
    }
};
export const userLogin = async (req, res) => {
    try {
        const data = req.body;
        const output = await vine.validate({
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
        const token = await user.generateAuthToken({
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
    }
    catch (error) {
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
export const userSignup = async (req, res) => {
    try {
        const data = req.body;
        const output = await vine.validate({
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
            }
            else {
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
        const mailOptions = {
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
    }
    catch (error) {
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
export const verifyEmail = async (req, res) => {
    try {
        const data = req.body;
        const output = await vine.validate({
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
        const verify = await bcrypt.compare(output.secretKey, verificationToken.secretKey);
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
        const token = await user.generateAuthToken({
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
    }
    catch (error) {
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
//# sourceMappingURL=userController.js.map