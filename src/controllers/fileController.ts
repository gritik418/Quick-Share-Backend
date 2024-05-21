import { Request, Response } from "express";
import upload from "../services/multerService.js";
import multer from "multer";
import File from "../models/fileModel.js";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = function (req: Request, res: Response) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(`Multer error: ${err}`);
    } else if (err) {
      console.log(err);
    }

    const secretKey = uuidv4();

    const file = new File({
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
