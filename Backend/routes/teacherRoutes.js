import express from "express";
const router = express.Router();

import {
  createTeacher,
  updateTeacher,
  getAllTeachers,
  getTeacherById,
  deleteTeacher,
} from "../controllers/teacherController.js"; // 👈 .js መጨመሩን እርግጠኛ ሁን

// የጥበቃ (Security) እና የፎቶ መጫኛ (Multer) Middleware
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ዝርዝር (ከ App.js ጋር ተመሳሳይ)
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */

/**
 * 1. የአስተማሪዎችን ዝርዝር ማየት (ለሁሉም ክፍት)
 */
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);

/* ================= ADMIN ONLY ROUTES ================= */

/**
 * 2. አዲስ አስተማሪ ለመመዝገብ
 */
router.post(
  "/",
  protect,
  allowRoles(...adminRoles), // 👈 ሁሉንም አድሚኖች እንዲፈቅድ
  multerMiddleware.fields([
    { name: "photo", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "emergencyPhoto", maxCount: 1 },
  ]),
  createTeacher
);

/**
 * 3. የአስተማሪ መረጃ ለማዘመን
 */
router.put(
  "/:id",
  protect,
  allowRoles(...adminRoles),
  multerMiddleware.fields([
    { name: "photo", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "emergencyPhoto", maxCount: 1 },
  ]),
  updateTeacher
);

/**
 * 4. አስተማሪን ከሲስተም ለመሰረዝ
 */
router.delete("/:id", protect, allowRoles(...adminRoles), deleteTeacher);
export default router; // 👈 module.exports ሳይሆን ይሄን ተጠቀም
