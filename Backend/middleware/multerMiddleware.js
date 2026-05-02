const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * 1. ፎልደሩ መኖሩን ማረጋገጥ
 */
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * 2. የፋይል ማከማቻ ውቅር (Storage Configuration)
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = "uploads/general/";
    const url = req.originalUrl;

    // --- ቅድሚያ የሚሰጠው በ URL ነው (ይህ ግጭትን ያስወግዳል) ---

    // ለተማሪዎች (Students)
    if (url.includes("students")) {
      dest = "uploads/students/";
    }
    // ለሼህ/መምህራን (Teachers)
    else if (url.includes("teachers")) {
      dest = "uploads/teachers/";
    }
    // ለምዝገባዎች (Enrollments)
    else if (url.includes("enrollments")) {
      dest = "uploads/enrollments/";
    }
    // ለምስክርነቶች (Testimonials)
    else if (url.includes("testimonials")) {
      dest = "uploads/testimonials/";
    }
    // ለቤተ-መጽሐፍት (Books)
    else if (url.includes("books") || url.includes("library")) {
      dest = "uploads/books/";
    }
    
    // ለትምህርቶች (Courses/Lessons)
    else if (url.includes("courses") || url.includes("lessons")) {
      dest = "uploads/lessons/";
    }
    // ካልታወቀ ግን በ Fieldname ለመለየት ሙከራ ያደርጋል
    else if (file.fieldname.includes("student")) {
      dest = "uploads/students/";
    } else if (["photo", "idCard", "emergencyPhoto"].includes(file.fieldname)) {
      dest = "uploads/teachers/";
    }

    ensureDirExists(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    // የፋይሉ ስም (ለምሳሌ፡ photo-171156...jpg)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

/**
 * 3. የፋይል አይነት ማጣሪያ (File Filter)
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions =
    /jpeg|jpg|png|webp|pdf|docx|zip|mpeg|wav|mp4|mp3|epub/;

  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Mime types ማጣሪያ
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
    fileSize: 100 * 1024 * 1024, // 100MB (ለቪዲዮ እና ኦዲዮ እንዲሆን)
  },
});

module.exports = upload;
