import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const addLesson = async (req, res) => {
  try {
    const { title, description, dayNumber, type } = req.body;
    const { id } = req.params;

    let filePath = null;
    if (req.files) {
      if (req.files["audio"]) filePath = req.files["audio"][0].path;
      if (req.files["pdf"]) filePath = req.files["pdf"][0].path;
      if (req.files["video"]) filePath = req.files["video"][0].path;
    }

    const newLesson = {
      title,
      description,
      type: type || "pdf",
      fileUrl: filePath,
      dayNumber: dayNumber || 1,
      createdAt: new Date(),
    };

    const course = await Course.findByIdAndUpdate(
      id,
      { $push: { lessons: newLesson } },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    }

    res.status(200).json({
      success: true,
      message: "ትምህርቱ በተሳካ ሁኔታ ተጨምሯል",
      data: course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "እባክዎ መጀመሪያ ይግቡ" });

    const studentEnrollments = await Enrollment.find({
      user: req.user.id,
      status: "approved",
    }).select("courseId");

    const courseIds = studentEnrollments.map((en) => en.courseId);
    const myCourses = await Course.find({ _id: { $in: courseIds } }).lean();

    res.status(200).json({ success: true, count: myCourses.length, data: myCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
