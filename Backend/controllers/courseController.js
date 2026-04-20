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
    // እዚህ ጋር .lean() ስንጠቀም enrollmentOpen መኖሩን ያረጋግጣል
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. አንድን ኮርስ በ ID ማግኘት (Get by ID)

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    }
    // ✅ ኮርሱ ሲላክ enrollmentOpen አብሮ መሄዱን አረጋግጥ
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. አዲስ ትምህርት (Lesson) ወደ ነባር ኮርስ ለመጨመር
exports.addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dayNumber, youtubeUrl } = req.body;

    // ፋይሎቹ መኖራቸውን ቼክ ማድረግ (MulterMiddleware.fields በመጠቀም የመጡ)
    const audioUrl = req.files?.audio ? req.files.audio[0].path : null;
    const pdfUrl = req.files?.pdf ? req.files.pdf[0].path : null;
    const videoUrl = req.files?.video ? req.files.video[0].path : null;

    const newLesson = {
      title,
      description,
      dayNumber: Number(dayNumber) || 1,
      youtubeUrl, // ከ YouTube የመጣ ሊንክ
      videoUrl, // ሰርቨር ላይ የተጫነ ቪዲዮ ካለ
      audioUrl, // የድምፅ ፋይል
      pdfUrl, // የንባብ ፋይል
      createdAt: new Date(),
    };

    const course = await Course.findByIdAndUpdate(
      id,
      { $push: { lessons: newLesson } },
      { new: true }
    );

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const mongoose = require("mongoose");

// --- ትምህርት ለማስተካከል (Update Lesson) ---
exports.updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { title, description, dayNumber, youtubeUrl } = req.body;

    // መሰረታዊ የፅሁፍ መረጃዎች
    const updateData = {
      "lessons.$.title": title,
      "lessons.$.description": description,
      "lessons.$.dayNumber": dayNumber,
      "lessons.$.youtubeUrl": youtubeUrl,
    };

    // ፋይሎች ከተጫኑ የፋይሉን path ጨምር
    if (req.files) {
      if (req.files["audio"]) {
        updateData["lessons.$.audioUrl"] = req.files["audio"][0].path.replace(
          /\\/g,
          "/"
        );
      }
      if (req.files["pdf"]) {
        updateData["lessons.$.pdfUrl"] = req.files["pdf"][0].path.replace(
          /\\/g,
          "/"
        );
      }
    }

    const course = await mongoose
      .model("Course")
      .findOneAndUpdate(
        { _id: id, "lessons._id": lessonId },
        { $set: updateData },
        { new: true }
      );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "ኮርሱ ወይም ትምህርቱ አልተገኘም" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ትምህርት ለማጥፋት (Delete Lesson) ---
exports.deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;

    const course = await mongoose
      .model("Course")
      .findByIdAndUpdate(
        id,
        { $pull: { lessons: { _id: lessonId } } },
        { new: true }
      );

    if (!course) {
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 5. ኮርስ ማሻሻል (Update)
exports.updateCourse = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) updatedData.thumbnail = req.file.path;

    const course = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!course)
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6. ኮርስ መሰረዝ (Delete)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, message: "ኮርሱ በትክክል ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. ተማሪው የተመዘገበባቸውን ኮርሶች ብቻ ማምጣት
exports.getStudentCourses = async (req, res) => {
  try {
    const studentEnrollments = await Enrollment.find({
      user: req.user.id,
      status: "approved",
    }).select("courseId");

    const courseIds = studentEnrollments.map((en) => en.courseId);
    const myCourses = await Course.find({ _id: { $in: courseIds } }).lean();

    res
      .status(200)
      .json({ success: true, count: myCourses.length, data: myCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8. የምዝገባ ሁኔታን ለመቀየር (Toggle Enrollment Status)
exports.toggleEnrollmentStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    }

    // ሁኔታውን ይቀይራል (Toggle)
    course.enrollmentOpen = !course.enrollmentOpen;

    // ✅ ዳታቤዝ ላይ እንዲቀመጥ ያደርጋል
    await course.save();

    res.status(200).json({
      success: true,
      message: `ምዝገባው በትክክል ${course.enrollmentOpen ? "ተከፍቷል" : "ተዘግቷል"}`,
      enrollmentOpen: course.enrollmentOpen,
    });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ success: false, message: "የሰርቨር ስህተት አጋጥሟል" });
  }
};
