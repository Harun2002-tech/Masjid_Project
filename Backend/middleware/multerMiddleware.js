import multer from "multer";
import uploadToCloudinary from "../utils/cloudinary.js";
import uploadToGoogleDrive from "../utils/googleDrive.js";

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

export const uploadToStorage = async (file) => {
  if (imageMimes.includes(file.mimetype)) {
    const folder = file.fieldname || "ruhama";
    return await uploadToCloudinary(file.buffer, folder);
  }

  if (pdfMimes.includes(file.mimetype)) {
    return await uploadToGoogleDrive(
      file.buffer,
      file.originalname,
      file.mimetype,
      process.env.GOOGLE_PDF_FOLDER_ID
    );
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
