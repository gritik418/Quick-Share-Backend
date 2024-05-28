import upload from "../services/multerService.js";
import multer from "multer";
import File from "../models/fileModel.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
export const uploadFile = function (req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(`Multer error: ${err}`);
        }
        else if (err) {
            console.log(err);
        }
        const secretKey = uuidv4();
        const file = new File({
            userId: req.params.id,
            fileName: req.file?.filename,
            originalName: req.file?.originalname,
            secretKey: secretKey,
            filePath: req.file?.path,
            fileType: req.file?.mimetype,
            fileSize: req.file?.size,
        });
        await file.save();
        const fileLink = `${process.env.DOMAIN}/${req.params?.id}/${secretKey}`;
        return res.status(201).json({
            success: true,
            status: 200,
            message: "File Uploaded.",
            link: fileLink,
        });
    });
};
export const findFile = async (req, res) => {
    try {
        const link = req.body.link.split("/");
        const userId = link[3];
        const secretKey = link[4];
        const file = await File.findOne({
            $and: [{ userId }, { secretKey }],
        });
        if (!file) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid Link.",
            });
        }
        if (file.accessCount >= 10) {
            await File.findByIdAndUpdate(file._id, {
                $set: { isExpired: true },
            });
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Link Expired.",
            });
        }
        const downloadLink = `${process.env.DOMAIN}/api/file/download/${secretKey}/${file.originalName}`;
        return res.status(200).json({
            success: true,
            status: 200,
            downloadLink,
            file: {
                fileSize: file.fileSize,
                originalName: file.originalName,
                fileType: file.fileType,
            },
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
export const downloadFile = async (req, res) => {
    try {
        const secretKey = req.params.secretKey;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const file = await File.findOne({ secretKey });
        if (!file) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid Link.",
            });
        }
        if (file.accessCount >= 10) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Download Link Expired.",
            });
        }
        await File.findByIdAndUpdate(file._id, {
            $inc: { accessCount: 1 },
        });
        const downloadPath = path.join(__dirname, "../public/uploads/", file.userId.toString(), file.fileName);
        res.setHeader("Content-disposition", `attachment; filename=${file.originalName}`);
        res.setHeader("Content-Type", file.fileType);
        return res.download(downloadPath, file.originalName);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            status: 400,
            message: "Server Error.",
        });
    }
};
//# sourceMappingURL=fileController.js.map