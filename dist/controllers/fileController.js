import upload from "../services/multerService.js";
import multer from "multer";
import File from "../models/fileModel.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
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
        const userId = link[1];
        const secretKey = link[2];
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
            await File.findByIdAndDelete(file._id);
            const filePath = path.resolve(__dirname, `./public/uploads/${userId}/${file.fileName}`);
            fs.rm(filePath, { recursive: true }, (err) => {
                if (err) {
                    return;
                }
            });
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Link Expired.",
            });
        }
        await File.findByIdAndUpdate(file._id, {
            $inc: { accessCount: 1 },
        });
        const downloadLink = `${process.env.DOMAIN}/api/download/${secretKey}/${file.originalName}`;
        return res.status(200).json({
            success: true,
            status: 200,
            downloadLink,
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
//# sourceMappingURL=fileController.js.map