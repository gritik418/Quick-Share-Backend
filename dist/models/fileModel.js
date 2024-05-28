import mongoose from "mongoose";
const FileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
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
    accessCount: {
        type: Number,
        default: 0,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const File = mongoose.models.File || mongoose.model("File", FileSchema);
export default File;
//# sourceMappingURL=fileModel.js.map