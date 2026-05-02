const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * 1. ፎልደሩ መኖሩን ማረጋገጥ (Path Fix)
 * VS Code ላይ ባየሁት መሰረት Backend/uploads ስለሆነ ያንን ታሳቢ ያደርጋል
 */
const ensureDirExists = (dir) => {
  // __dirname በመጠቀም ሁልጊዜ ከዚህ ፋይል ተነስቶ ትክክለኛውን ቦታ እንዲያገኝ ያደርጋል
  const absolutePath = path.resolve(dir);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }
};

/**
 * 2. የፋይል ማከማቻ ውቅር
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ⚠️ ስክሪንሾትህ ላይ uploads ያለው Backend ውስጥ ስለሆነ መንገዱን እናስተካክለው
    // ሰርቨርህን የምታስነሳው ከ Root ፎልደር ከሆነ "Backend/uploads/..." መሆን አለበት
    let baseDest = "Backend/uploads/";

    // ሰርቨሩን የምታስነሳው በራሱ በ Backend ፎልደር ውስጥ ከሆነ ግን "uploads/" ብቻ ይበቃል
    // ለደህንነት ሲባል ፎልደሩ ካልተገኘ "uploads/" እንዲሆን እናድርገው
    if (!fs.existsSync("Backend")) {
      baseDest = "uploads/";
    }

    let subDir = "general/";
    const url = (req.originalUrl || "").toLowerCase();

    // ዩአርኤልን መሠረት በማድረግ ፎልደር መምረጥ
    if (url.includes("student")) subDir = "students/";
    else if (url.includes("teacher")) subDir = "teachers/";
    else if (url.includes("enrollment")) subDir = "enrollments/";
    else if (url.includes("testimonial")) subDir = "testimonials/";
    else if (url.includes("book") || url.includes("library")) subDir = "books/";
    else if (url.includes("course") || url.includes("lesson"))
      subDir = "lessons/";

    const finalDest = path.join(baseDest, subDir);

    ensureDirExists(finalDest);
    cb(null, finalDest);
  },
  filename: (req, file, cb) => {
    // የፋይል ስም ክፍተቶች (spaces) ካሉት በ ሰረዝ እንዲተካ እናደርጋለን
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

module.exports = upload;
