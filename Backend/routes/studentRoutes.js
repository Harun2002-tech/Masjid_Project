import express from "express";
const router = express.Router();

import {
  getAllStudents,
  createStudent,
  applyAsStudent,
  approveStudent,
  rejectStudent,
  getMyApplications,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCourses,
} from "../controllers/studentController.js"; // 👈 .js መጨመር እንዳትረሳ

import { protect, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import processUploads from "../middleware/processUploads.js";

// 🚀 ሁሉንም አድሚኖች እንዲገቡ ፈቅደናል ("superadmin", "masjid_admin")
const allAdmins = ["admin", "superadmin", "masjid_admin"];

const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "studentIDPhoto", maxCount: 1 },
  { name: "emergencyIDPhoto", maxCount: 1 },
]);

// 0. ማንኛውም የገባ ተጠቃሚ ራሱን መመዝገብ/ማመልከት እንዲችል (ልክ ማመልከቻ ሲልክ pending ይሆናል)
//    ⚠️ ይህ ከ "/:id" በፊት መስፈር አለበት፣ አለበለዚያ "apply" የ :id ተብሎ ይያዛል
router.post(
  "/apply",
  protect,
  uploadFields,
  processUploads,
  applyAsStudent
);

// የራስን ማመልከቻ ደረጃ ማየት
router.get("/my-applications", protect, getMyApplications);

// 1. ሁሉንም ማምጣት (አድሚን/መምህር) እና አድሚን በቀጥታ አዲስ ተማሪ መመዝገብ (ወዲያውኑ ጸድቆ)
router
  .route("/")
  .get(protect, allowRoles(...allAdmins, "teacher"), getAllStudents)
  .post(
    protect,
    allowRoles(...allAdmins),
    uploadFields,
    processUploads,
    createStudent
  );

// 2. አድሚን ማመልከቻን ማጽደቅ / ውድቅ ማድረግ
router.put("/:id/approve", protect, allowRoles(...allAdmins), approveStudent);
router.put("/:id/reject", protect, allowRoles(...allAdmins), rejectStudent);

// 3. በ ID መፈለግ፣ ማዘመን እና መሰረዝ
router
  .route("/:id")
  .get(protect, allowRoles(...allAdmins, "teacher", "student"), getStudentById)
  .put(
    protect,
    allowRoles(...allAdmins, "teacher"),
    uploadFields,
    processUploads,
    updateStudent
  )
  .delete(protect, allowRoles("superadmin", "admin"), deleteStudent);

// 4. የተማሪ ኮርሶችን ማምጣት
router.get(
  "/:id/courses",
  protect,
  allowRoles(...allAdmins, "teacher", "student"),
  getStudentCourses
);

export default router;