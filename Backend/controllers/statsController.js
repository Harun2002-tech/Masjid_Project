const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");

/**
 * @desc    ከ Student እና Teacher ሞዴሎች ትክክለኛ መረጃዎችን ቆጥሮ ያመጣል
 * @route   GET /api/stats
 */
exports.getStats = async (req, res) => {
  try {
    // 1. ከተማሪዎች ሰንጠረዥ (Collection) ላይ ያሉትን ሁሉንም መቁጠር
    const studentCount = await Student.countDocuments();

    // 2. ከኡስታዞች ሰንጠረዥ (Collection) ላይ ያሉትን ሁሉንም መቁጠር
    const teacherCount = await Teacher.countDocuments();

    // 3. ከኮርሶች ሰንጠረዥ ላይ መቁጠር
    const courseCount = await Course.countDocuments();

    // 4. የአገልግሎት ዘመንን ማስላት (ከ 1994 ጀምሮ)
    const startYear = 2019;
    const currentYear = new Date().getFullYear(); // 2026
    const serviceYears = currentYear - startYear;

    // 5. ዳታውን ለፍሮንትኤንድ መላክ
    res.status(200).json({
      success: true,
      data: {
        // ቁጥሮቹ ከዜሮ በላይ ከሆኑ ትክክለኛውን፣ ከሌሉ ደግሞ default ቁጥሮችን ይልካል
        activeStudents: studentCount > 0 ? `${studentCount}+` : "500+", 
        yearsOfService: `${serviceYears}+`,
        qualifiedScholars: teacherCount > 0 ? `${teacherCount}+` : "15+",
        totalCourses: courseCount > 0 ? `${courseCount}+` : "20+",
        masjidLocations: "1" 
      }
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "መረጃዎችን መቁጠር አልተቻለም",
      error: error.message,
    });
  }
};