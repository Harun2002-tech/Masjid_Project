import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

connectDB();

const app = express();

const allowedOrigins = [
  "https://ruhamaislamiccenter.com",
  "https://www.ruhamaislamiccenter.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- API ROUTES ---------------- */
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
import adminRoutes from "./routes/admin.routes.js";
import eventRoutes from "./routes/eventRoutes.js";

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
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Ruhama Islamic Center API is Running...");
});

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
  console.log(`Server is running on port ${PORT}`);
});
