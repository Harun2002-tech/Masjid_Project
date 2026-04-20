import express from "express";
const router = express.Router();

// ሁሉንም ተግባራት ከአንድ ኮንትሮለር እናመጣለን
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getStudentCourses,
  addLesson,
  updateLesson,
  deleteLesson,
  toggleEnrollmentStatus,
} from "../controllers/courseController.js"; // 👈 .js መጨመሩን አረጋግጥ

import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር (ከ App.js ጋር ተመሳሳይ እንዲሆን)
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

/* ================= STUDENT ROUTES ================= */
router.get("/my/list", protect, allowRoles("student"), getStudentCourses);

/* ================= ADMIN & TEACHER ROUTES ================= */

/**
 * 1. አዲስ ኮርስ መፍጠር
 */
router.post(
  "/",
  protect,
  allowRoles(...adminRoles, "teacher"), // 👈 ሁሉንም አድሚኖች እና መምህራንን ይፈቅዳል
  multerMiddleware.single("thumbnail"),
  createCourse
);

/**
 * 2. አዲስ ትምህርት (Lesson) መጨመሪያ
 */
router.post(
  "/:id/lessons",
  protect,
  allowRoles(...adminRoles, "teacher"),
  multerMiddleware.fields([
    { name: "audio", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addLesson
);

/**
 * 3. የነበረን ትምህርት ማስተካከያ (Update Lesson)
 */
router.put(
  "/:id/lessons/:lessonId",
  protect,
  allowRoles(...adminRoles, "teacher"),
  multerMiddleware.fields([
    { name: "audio", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateLesson
);

/**
 * 4. ትምህርት መሰረዝ (Delete Lesson)
 */
router.delete(
  "/:id/lessons/:lessonId",
  protect,
  allowRoles(...adminRoles, "teacher"),
  deleteLesson
);

/**
 * 5. የኮርስ መረጃ ማስተካከያ (Update Course)
 */
router.put(
  "/:id",
  protect,
  allowRoles(...adminRoles, "teacher"),
  multerMiddleware.single("thumbnail"),
  updateCourse
);

/**
 * 6. የምዝገባ ሁኔታን ለመቀየር (Toggle Enrollment)
 */
router.patch(
  "/:id/toggle-enrollment",
  protect,
  allowRoles(...adminRoles, "teacher"),
  toggleEnrollmentStatus
);

/* ================= ADMIN ONLY ================= */

/**
 * 7. ሙሉ ኮርሱን መሰረዝ
 */
router.delete("/:id", protect, allowRoles(...adminRoles), deleteCourse);

export default router;
