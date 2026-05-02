import express from "express";
const router = express.Router();

import {
  submitEnrollment,
  getAllEnrollments,
  getMyEnrollments,
  approveEnrollment,
  rejectEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateProgress,
  getEnrollmentStatus,
} from "../controllers/enrollmentController.js"; // 👈 .js መጨመሩን እርግጠኛ ሁን

import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር (ከ App.js ጋር አንድ አይነት እንዲሆን)
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= STUDENT ROUTES ================= */

// የተማሪ የራሱ ምዝገባዎች ዝርዝር
router.get("/my-list", protect, getMyEnrollments);

// አዲስ ምዝገባ ለማስገባት (መታወቂያ ፎቶን ጨምሮ)
router.post(
  "/apply",
  protect,
  multerMiddleware.single("idCardImage"),
  submitEnrollment
);

// የትምህርት ሂደትን (Progress) ለማዘመን
router.patch("/progress/:courseId", protect, updateProgress);

/* ================= ADMIN ROUTES ================= */

// ሁሉም የተመዘገቡ ተማሪዎች ዝርዝር (ለአድሚኖች ብቻ)
router.get("/", protect, allowRoles(...adminRoles), getAllEnrollments);

// ምዝገባን ለማጽደቅ
router.patch(
  "/approve/:id",
  protect,
  allowRoles(...adminRoles),
  approveEnrollment
);

// ምዝገባን ውድቅ ለማድረግ
router.patch(
  "/reject/:id",
  protect,
  allowRoles(...adminRoles),
  rejectEnrollment
);

// በ Course ID መፈለግ

router.get("/status/:courseId", protect, getEnrollmentStatus);
// የምዝገባ መረጃን ለማስተካከል
router.put("/:id", protect, allowRoles(...adminRoles), updateEnrollment);

// ምዝገባን ሙሉ ለሙሉ ለመሰረዝ
router.delete("/:id", protect, allowRoles(...adminRoles), deleteEnrollment);

export default router;
