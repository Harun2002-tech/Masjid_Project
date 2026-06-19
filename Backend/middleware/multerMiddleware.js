import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import uploadToCloudinary from "../utils/cloudinary.js";
import uploadToGoogleDrive from "../utils/googleDrive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads/books");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const imageMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const pdfMimes = ["application/pdf"];
const audioMimes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/mp4"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    ...imageMimes,
    ...pdfMimes,
    ...audioMimes,
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "video/mp4",
    "application/epub+zip",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("ያልተፈቀደ የፋይል አይነት!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const saveFileLocally = (buffer, fileName) => {
  const uniqueName = `${Date.now()}-${fileName}`;
  const filePath = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/books/${uniqueName}`;
};

export const uploadToStorage = async (file) => {
  if (imageMimes.includes(file.mimetype)) {
    const folder = file.fieldname || "ruhama";
    return await uploadToCloudinary(file.buffer, folder);
  }

  if (pdfMimes.includes(file.mimetype)) {
    return saveFileLocally(file.buffer, file.originalname);
  }

  if (audioMimes.includes(file.mimetype)) {
    return await uploadToGoogleDrive(
      file.buffer,
      file.originalname,
      file.mimetype,
      process.env.GOOGLE_MUSIC_FOLDER_ID
    );
  }

  throw new Error("Unsupported file type for storage routing");
};

export default upload;
