import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { countDocs, getDocs, collections } from "../utils/firestore.js";

const router = express.Router();
const adminRoles = ["admin", "superadmin", "masjid_admin"];

router.get("/stats", protect, allowRoles(...adminRoles), async (req, res) => {
  try {
    const [studentCount, teacherCount, adminUsers, recentStudents] = await Promise.all([
      countDocs(collections.students),
      countDocs(collections.teachers),
      getDocs(collections.users, {
        where: [{ field: "role", op: "in", value: adminRoles }],
      }),
      getDocs(collections.students, { orderBy: "createdAt", orderDir: "desc", limit: 5 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          students: studentCount,
          teachers: teacherCount,
          admins: adminUsers.length,
        },
        recentActivity: { newStudents: recentStudents },
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
