const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");

/**
 * ረዳት ተግባር: የፋይል Path ማስተካከያ
 */
const formatPath = (filePath) =>
  filePath ? filePath.replace(/\\/g, "/") : null;

// 1. ሁሉንም ተማሪዎች ማምጣት
exports.getAllStudents = async (req, res) => {
  
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "ተማሪዎችን ማምጣት አልተቻለም",
        error: err.message,
      });
  }
};

// 2. አዲስ ተማሪ መመዝገብ
exports.createStudent = async (req, res) => {
  console.log("የመጣው ዳታ:", req.body); // ይህ በፍሮንትኤንድ የተላከውን ያሳያል
  console.log("የመጡት ፋይሎች:", req.files); // ፋይሎቹ በትክክል መምጣታቸውን ያሳያል
  try {
    const { subjects, email, ...rest } = req.body;

    // ሀ. ኢሜይል ቀድሞ መኖሩን ማረጋገጥ
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res
        .status(400)
        .json({ success: false, message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል" });
    }

    const studentData = { ...rest, email };

    // ፎቶዎችን ማስተካከል... (የነበረው ኮድ እንዳለ ይቀጥላል)
    if (req.files) {
      if (req.files.photo) studentData.photo = formatPath(req.files.photo[0].path);
      if (req.files.studentIDPhoto) studentData.studentIDPhoto = formatPath(req.files.studentIDPhoto[0].path);
      if (req.files.emergencyIDPhoto) studentData.emergencyIDPhoto = formatPath(req.files.emergencyIDPhoto[0].path);
    }

    if (subjects) {
      try {
        studentData.subjects = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
      } catch (e) {
        studentData.subjects = subjects;
      }
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: `ተማሪው በቁጥር ${student.studentID} ተመዝግቧል`,
      data: student,
    });

  } catch (error) {
    // === እዚህ ጋር ነው የምትቀይረው ===
    console.error("የምዝገባ ስህተት ዝርዝር:", error); // Terminal ላይ ስህተቱን ለማየት

    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
    }
    
    // ስህተቱን ለ Frontend መላክ
    res.status(400).json({ 
      success: false, 
      message: error.message || "ምዝገባ አልተሳካም" 
    });
  }
};

// 3. አንድ ተማሪ በ ID መፈለግ
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "የፍለጋ ስህተት", error: err.message });
  }
};

// 4. የተማሪ መረጃ ማዘመን
exports.updateStudent = async (req, res) => {
  try {
    const currentStudent = await Student.findById(req.params.id);
    if (!currentStudent)
      return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });

    let updateData = { ...req.body };

    // ሀ. ፋይሎችን ማስተካከል
    if (req.files) {
      const fileFields = ["photo", "studentIDPhoto", "emergencyIDPhoto"];
      fileFields.forEach((field) => {
        if (req.files[field]) {
          // የድሮውን ፋይል ማጥፋት
          if (currentStudent[field] && fs.existsSync(currentStudent[field])) {
            try {
              fs.unlinkSync(currentStudent[field]);
            } catch (e) {
              console.log("Old file delete error");
            }
          }
          updateData[field] = formatPath(req.files[field][0].path);
        }
      });
    }

    // ለ. Subjects Parsing
    if (updateData.subjects) {
      try {
        updateData.subjects =
          typeof updateData.subjects === "string"
            ? JSON.parse(updateData.subjects)
            : updateData.subjects;
      } catch (e) {
        // Parsing ካልቻለ ባለበት ይተወዋል
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, message: "የተማሪው መረጃ ታድሷል", data: student });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "ማዘመን አልተሳካም", error: err.message });
  }
};

// 5. ተማሪ መሰረዝ
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });

    const fields = ["photo", "studentIDPhoto", "emergencyIDPhoto"];
    fields.forEach((field) => {
      if (student[field] && fs.existsSync(student[field])) {
        try {
          fs.unlinkSync(student[field]);
        } catch (e) {
          console.log("File delete error");
        }
      }
    });

    await student.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "ተማሪው እና ተያያዥ ፋይሎች ተሰርዘዋል" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "ስረዛው አልተሳካም", error: err.message });
  }
};
// 6. የተማሪውን ኮርሶች ማምጣት
exports.getStudentCourses = async (req, res) => {
  try {
    // Course ሞዴል እዚህ ጋር መጠራት አለበት
    const Course = require("../models/Course");
    const courses = await Course.find({ student: req.params.id });
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "ኮርሶችን ማምጣት አልተቻለም",
        error: err.message,
      });
  }
};
