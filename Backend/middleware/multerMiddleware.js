import multer from "multer";
import uploadToCloudinary from "../utils/cloudinary.js";

// -----------------------------
// File Types
// -----------------------------
const imageMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const pdfMimes = ["application/pdf"];
const audioMimes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/mp4"];

// -----------------------------
// Multer Setup (Memory Storage)
// -----------------------------
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
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// -----------------------------
// Storage Router
// -----------------------------
export const uploadToStorage = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  console.log(
    `[Upload] ${file.originalname} (${file.mimetype})`
  );

  try {
    const folder = file.fieldname || "ruhama";

    const url = await uploadToCloudinary(file.buffer, folder);

    console.log(`✓ Uploaded: ${file.originalname}`);

    return url;

  } catch (error) {
    console.error("❌ Upload failed:", error.message);

    throw new Error(
      error.message || "File upload failed. Check server logs."
    );
  }
};

export default upload; 