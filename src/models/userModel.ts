import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JwtPayloadType } from "../types/index.js";

export type TokenType = {
  id: string;
};

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      minLength: 8,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function (payload: JwtPayloadType) {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
