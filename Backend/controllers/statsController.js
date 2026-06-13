import { countDocs, collections } from "../utils/firestore.js";

export const getStats = async (req, res) => {
  try {
    const [studentCount, teacherCount, courseCount] = await Promise.all([
      countDocs(collections.students),
      countDocs(collections.teachers),
      countDocs(collections.courses),
    ]);
    const startYear = 2019;
    const currentYear = new Date().getFullYear();
    const serviceYears = currentYear - startYear;
    res.status(200).json({
      success: true,
      data: {
        activeStudents: studentCount > 0 ? `${studentCount}+` : "500+",
        yearsOfService: `${serviceYears}+`,
        qualifiedScholars: teacherCount > 0 ? `${teacherCount}+` : "15+",
        totalCourses: courseCount > 0 ? `${courseCount}+` : "20+",
        masjidLocations: "1",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
