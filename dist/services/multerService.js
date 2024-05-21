import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const directory = `./public/uploads/${req.params?.id}/`;
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        cb(null, directory);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000 * 1000 * 10, // 10 MB
    },
}).single("file");
export default upload;
//# sourceMappingURL=multerService.js.map