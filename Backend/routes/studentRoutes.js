import express from "express";
const router = express.Router();

import {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses,
} from "../controllers/studentController.js"; // 👈 .js መጨመር እንዳትረሳ

import { protect, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

// 🚀 ሁሉንም አድሚኖች እንዲገቡ ፈቅደናል ("superadmin", "masjid_admin")
const allAdmins = ["admin", "superadmin", "masjid_admin"];

// 1. ሁሉንም ማምጣት እና አዲስ መመዝገብ
router
  .route("/")
  .get(protect, allowRoles(...allAdmins, "teacher"), getAllStudents)
  .post(
    protect,
    allowRoles(...allAdmins),
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "studentIDPhoto", maxCount: 1 },
      { name: "emergencyIDPhoto", maxCount: 1 },
    ]),
    createStudent
  );

// 2. በ ID መፈለግ፣ ማዘመን እና መሰረዝ
router
  .route("/:id")
  .get(protect, allowRoles(...allAdmins, "teacher", "student"), getStudentById)
  .put(
    protect,
    allowRoles(...allAdmins, "teacher"),
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "studentIDPhoto", maxCount: 1 },
      { name: "emergencyIDPhoto", maxCount: 1 },
    ]),
    updateStudent
  )
  .delete(protect, allowRoles("superadmin", "admin"), deleteStudent);

// 3. የተማሪ ኮርሶችን ማምጣት
router.get(
  "/:id/courses",
  protect,
  allowRoles(...allAdmins, "teacher", "student"),
  getStudentCourses
);

export default router; // 👈 module.exports ሳይሆን ይሄን ተጠቀም
