import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { countDocs, getDocs, collections } from "../utils/firestore.js";

const router = express.Router();
const adminRoles = ["admin", "superadmin", "masjid_admin"];

const STUDENT_LIST_FIELDS = [
  "firstName", "lastName", "email", "phone", "gender", "photo",
  "studentID", "gradeLevel", "shift", "applicationStatus", "createdAt",
];
const TEACHER_LIST_FIELDS = [
  "firstName", "lastName", "email", "phone", "photo", "teacherID",
  "subjects", "experienceYears", "rating", "isActive", "createdAt",
];

// Lightweight dashboard payload: server-side aggregate counts + only the 5
// most recent records (field-masked). Avoids shipping full collections.
router.get("/stats", protect, allowRoles(...adminRoles), async (req, res) => {
  try {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [studentCount, teacherCount, courseCount, newStudents, recentStudents, recentTeachers] =
      await Promise.all([
        countDocs(collections.students),
        countDocs(collections.teachers),
        countDocs(collections.courses),
        countDocs(collections.students, {
          where: [{ field: "createdAt", op: ">=", value: dayAgo }],
        }),
        getDocs(collections.students, {
          orderBy: "createdAt",
          orderDir: "desc",
          limit: 5,
          select: STUDENT_LIST_FIELDS,
        }),
        getDocs(collections.teachers, {
          orderBy: "createdAt",
          orderDir: "desc",
          limit: 5,
          select: TEACHER_LIST_FIELDS,
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          students: studentCount,
          teachers: teacherCount,
          courses: courseCount,
          newStudents,
        },
        recentStudents,
        recentTeachers,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
