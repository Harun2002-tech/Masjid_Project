import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js"; // .js መጨመር እንዳትረሳ

// 1. የዳታቤዝ ግንኙነት
connectDB();

// ES Modules ላይ __dirname ስለሌለ ይሄን እንጠቀማለን
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. የፎልደር ዝግጅት
const rootUploads = path.join(__dirname, "uploads");
const subDirs = [
  "books",
  "teachers",
  "students",
  "enrollments",
  "news",
  "lessons",
  "testimonials",
  "general",
];

if (!fs.existsSync(rootUploads)) {
  fs.mkdirSync(rootUploads);
}

subDirs.forEach((dir) => {
  const fullPath = path.join(rootUploads, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📂 ማህደር ተፈጥሯል: ${fullPath}`);
  }
});

const app = express();
const corsOptions = {
  origin: "https://ruhamaislamiccenter.vercel.app", // ያንተ የቪርሴል ሊንክ
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // 👈 ይህ መስመር የግድ ያስፈልጋል!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- API ROUTES ---------------- */
// 🚀 ሁሉንም ወደ import ቀይረናቸዋል - የፋይል ስሞቹን .js መጨመርህን አረጋግጥ
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import masjidRoutes from "./routes/prayerRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

import statsRoutes from "./routes/statsRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import testimonialsRoutes from "./routes/testimonialRoutes.js";
import paymentRoutes from "./routes/payment.Routes.js";
import contactRoutes from "./routes/contactRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import newsletterRouter from "./routes/newsletterRouter.js";

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/masjids", masjidRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/newsletter", newsletterRouter);

app.get("/", (req, res) => {
  res.send("Ruhama Islamic Center API is Running...");
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error Detail:", err.message);
  res.status(500).json({
    success: false,
    message: "በሰርቨሩ ላይ ስህተት ተከስቷል",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
