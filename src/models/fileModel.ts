import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
    },
    filePath: {
      type: String,
      required: true,
      unique: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model("File", FileSchema);

export default File;
