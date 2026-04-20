import express from "express";
const router = express.Router();

import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js"; // 👈 .js መጨመር እንዳትረሳ

// የሚድልዌር ፋይሎችን ማምጣት
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */

// 1. ሁሉንም የፕሮግራም ዝርዝሮች ለማየት
router.get("/", getSchedules);

// 2. የአንድን ፕሮግራም ዝርዝር በ ID ለማየት
router.get("/:id", getScheduleById);

/* ================= ADMIN & TEACHER ROUTES ================= */

/**
 * 3. አዲስ ፕሮግራም ለመመዝገብ
 */
router.post(
  "/",
  protect,
  allowRoles(...adminRoles, "teacher"), // 👈 ሁሉንም አድሚኖች እና መምህራንን ይፈቅዳል
  multerMiddleware.single("file"),
  createSchedule
);

/**
 * 4. ፕሮግራም ለማሻሻል
 */
router.put(
  "/:id",
  protect,
  allowRoles(...adminRoles, "teacher"),
  multerMiddleware.single("file"),
  updateSchedule
);

/**
 * 5. ፕሮግራም ለመሰረዝ (ለአድሚን ብቻ)
 */
router.delete("/:id", protect, allowRoles(...adminRoles), deleteSchedule);

export default router;
