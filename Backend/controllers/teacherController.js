const fs = require("fs");
const path = require("path");
const Teacher = require("../models/Teacher");

/* =========================================================
   CREATE TEACHER
========================================================= */
exports.createTeacher = async (req, res) => {
  try {
    // 1. የግዴታ መረጃዎችን ከ req.body ማውጣት
    const { firstName, lastName, email, phone, bio, subjects, password } = req.body;

    // 2. የግዴታ መረጃዎች መኖራቸውን ቼክ ማድረግ
    if (!firstName || !lastName || !email || !phone || !bio || !password) {
      // ስህተት ካለ የተጫኑ ፋይሎችን ማጥፋት (Cleanup)
      if (req.files) {
        Object.values(req.files).forEach(fileArr => {
          fileArr.forEach(file => fs.unlinkSync(file.path));
        });
      }
      return res.status(400).json({ success: false, message: "እባክዎ ሁሉንም የግዴታ መስኮች ይሙሉ!" });
    }

    // 3. የፋይል መንገዶችን ማዘጋጀት (Paths)
    const filePaths = {};
    if (req.files) {
      if (req.files.photo) filePaths.photo = req.files.photo[0].path;
      if (req.files.idCard) filePaths.idCard = req.files.idCard[0].path;
      if (req.files.emergencyPhoto) filePaths.emergencyPhoto = req.files.emergencyPhoto[0].path;
    }

    // የሼሁ ፎቶ ከሌለ እንዲመዘግብ አንፈቅድም
    if (!filePaths.photo) {
      return res.status(400).json({ success: false, message: "እባክዎ የሼሁን ፎቶ ይጫኑ!" });
    }

    // 4. Subjects Array መሆኑን ማረጋገጥ
    let subjectsArray = [];
    if (subjects) {
      try {
        subjectsArray = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
      } catch (e) {
        subjectsArray = subjects.split(",").map((s) => s.trim());
      }
    }

    // 5. ሁሉንም መረጃ ሰብስቦ ዳታቤዝ ውስጥ መመዝገብ
    const teacherData = {
      ...req.body,
      subjects: subjectsArray,
      ...filePaths // ፎቶዎቹን እዚህ ጋር ይጨምራቸዋል
    };

    const teacher = await Teacher.create(teacherData);

    res.status(201).json({ success: true, data: teacher });

  } catch (error) {
    // ስህተት ሲፈጠር ፋይሎችን ማጽዳት
    if (req.files) {
      Object.values(req.files).forEach(fileArr => {
        fileArr.forEach(file => fs.unlinkSync(file.path));
      });
    }
    console.error("Create Teacher Error:", error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? "ይህ ኢሜይል ቀድሞ ተመዝግቧል!" : error.message,
    });
  }
};

/* =========================================================
   UPDATE TEACHER
========================================================= */
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "መምህሩ አልተገኘም" });
    }

    let updateData = { ...req.body };

    // Subjects ማስተካከያ
    if (req.body.subjects) {
      try {
        updateData.subjects = typeof req.body.subjects === "string" 
          ? JSON.parse(req.body.subjects) 
          : req.body.subjects;
      } catch (e) {
        updateData.subjects = req.body.subjects.split(",").map((s) => s.trim());
      }
    }

    // አዳዲስ ፋይሎች ከተላኩ አሮጌዎቹን አጥፍቶ አዲሶቹን መመዝገብ
    if (req.files) {
      const fields = ["photo", "idCard", "emergencyPhoto"];
      fields.forEach(field => {
        if (req.files[field]) {
          // አሮጌውን ፋይል አጥፋ
          if (teacher[field]) {
            const oldPath = path.join(__dirname, "../../", teacher[field]);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          // አዲሱን መንገድ መዝግብ
          updateData[field] = req.files[field][0].path;
        }
      });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedTeacher });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach(fileArr => {
        fileArr.forEach(file => fs.unlinkSync(file.path));
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   DELETE TEACHER
========================================================= */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "አልተገኘም" });

    // ሁሉንም ፋይሎች (ፎቶ፣ መታወቂያ፣ የተጠሪ ፎቶ) ማጥፋት
    const fields = ["photo", "idCard", "emergencyPhoto"];
    fields.forEach(field => {
      if (teacher[field]) {
        const fullPath = path.join(__dirname, "../../", teacher[field]);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await teacher.deleteOne();
    res.status(200).json({ success: true, message: "የመምህሩ መረጃ ሙሉ በሙሉ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// የተቀሩት getAllTeachers እና getTeacherById እንዳሉ ይቀጥላሉ...
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "አልተገኘም" });
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};