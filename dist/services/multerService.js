import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const directory = path.join(__dirname, `../public/uploads/${req.params?.id}/`);
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