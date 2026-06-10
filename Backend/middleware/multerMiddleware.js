import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsRoot = path.join(__dirname, "..", "uploads");

    let subDir = "general/";
    const url = (req.originalUrl || "").toLowerCase();

    if (url.includes("student")) subDir = "students/";
    else if (url.includes("teacher")) subDir = "teachers/";
    else if (url.includes("enrollment")) subDir = "enrollments/";
    else if (url.includes("testimonial")) subDir = "testimonials/";
    else if (url.includes("book") || url.includes("library")) subDir = "books/";
    else if (url.includes("course") || url.includes("lesson"))
      subDir = "lessons/";
    else if (url.includes("news")) subDir = "news/";

    const finalDest = path.join(uploadsRoot, subDir);

    ensureDirExists(finalDest);
    cb(null, finalDest);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(safeName).toLowerCase();

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

/**
 * 3. የፋይል አይነት ማጣሪያ
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions =
    /jpeg|jpg|png|webp|pdf|docx|zip|mpeg|wav|mp4|mp3|epub/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "audio/mpeg",
    "audio/wav",
    "video/mp4",
    "audio/mp3",
    "application/epub+zip",
  ];

  if (extname && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("ያልተፈቀደ የፋይል አይነት!"), false);
  }
};

/**
 * 4. Middleware ውቅር
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

export default upload;
