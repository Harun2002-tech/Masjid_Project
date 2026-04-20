import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js"; // 👈 የስሙን አጻጻፍ (authMiddleware.js) አረጋግጥ
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
// import Course from "../models/Course.js"; // 💡 ኮርስ ሞዴል ከሌለህ ለጊዜው Comment አድርገው

const router = express.Router();

// የአድሚን ሮሎች ዝርዝር (ከሌሎቹ ጋር ተመሳሳይ እንዲሆን)
const adminRoles = ["admin", "superadmin", "masjid_admin"];

// ሁሉንም ዳታዎች ጠቅለል አድርጎ ለዳሽቦርድ የሚሰጥ API
router.get(
  "/stats",
  protect,
  allowRoles(...adminRoles), // 👈 ሁሉንም አይነት አድሚኖች ይፈቅዳል
  async (req, res) => {
    try {
      // ሁሉንም ዳታዎች በአንድ ጊዜ በፓራለል (Parallel) እናምጣ
      const [studentCount, teacherCount, adminCount, recentStudents] =
        await Promise.all([
          Student.countDocuments(),
          Teacher.countDocuments(),
          User.countDocuments({ role: { $in: adminRoles } }), // የአድሚኖች ብዛት
          Student.find().sort({ createdAt: -1 }).limit(5), // በቅርብ የተመዘገቡ 5 ተማሪዎች
        ]);

      res.status(200).json({
        success: true,
        data: {
          summary: {
            students: studentCount,
            teachers: teacherCount,
            admins: adminCount,
            // courses: 0 // ኮርስ ሞዴል ገና ካልሰራህ 0 አድርገው
          },
          recentActivity: {
            newStudents: recentStudents,
          },
        },
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
