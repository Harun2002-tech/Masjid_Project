const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// 1. አዲስ ኮርስ መፍጠር (Create)
exports.createCourse = async (req, res) => {
  try {
    let courseData = { ...req.body };

    if (courseData.lessons && typeof courseData.lessons === "string") {
      try {
        courseData.lessons = JSON.parse(courseData.lessons);
      } catch (e) {
        console.error("JSON Parsing error:", e);
      }
    }

    if (req.file) {
      courseData.thumbnail = req.file.path;
    }

    const newCourse = await Course.create(courseData);
    res.status(201).json({ success: true, data: newCourse });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. ሁሉንም ኮርሶች ለማግኘት (Get All)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. አንድን ኮርስ በ ID ማግኘት (Get by ID)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. አዲስ ትምህርት (Lesson) ወደ ነባር ኮርስ ለመጨመር (Add Lesson with Audio/PDF)
exports.addLesson = async (req, res) => {
  try {
    const { title, description, dayNumber, type } = req.body;
    const { id } = req.params; // በ Router ላይ :id ካልከው

    // ሙልተር የላከውን ፋይል አድራሻ መያዝ
    // ኦዲዮ ወይም ፒዲኤፍ ምንም ይሁን 'fileUrl' በሚለው ፊልድ ስር እንዲቀመጥ
    let filePath = null;
    if (req.files) {
      if (req.files["audio"]) filePath = req.files["audio"][0].path;
      if (req.files["pdf"]) filePath = req.files["pdf"][0].path;
      if (req.files["video"]) filePath = req.files["video"][0].path;
    }

    const newLesson = {
      title,
      description,
      type: type || "pdf", // "audio", "video" ወዘተ...
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

// 5. ኮርስ ማሻሻል (Update)
exports.updateCourse = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const course = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6. ኮርስ መሰረዝ (Delete)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, message: "ኮርሱ በትክክል ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. ተማሪው የተመዘገበባቸውን ኮርሶች ብቻ ማምጣት
exports.getStudentCourses = async (req, res) => {
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