import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Teacher from "../models/Teacher.js"; // .js መጨመሩን እርግጠኛ ሁን

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CREATE TEACHER//
export const createTeacher = async (req, res) => {
  try {
    // 1. ሁሉንም መረጃዎች ከ req.body መቀበል
    // Schemaው ላይ ያሉትን ሁሉንም እዚህ ጋር እናገኛቸዋለን
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      password,
      subjects,
      availableDays,
      experienceYears,
    } = req.body;

    // 2. የግዴታ መረጃዎች መኖራቸውን ቼክ ማድረግ (Validation)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !bio ||
      !password ||
      !experienceYears
    ) {
      if (req.files) {
        Object.values(req.files).forEach((fileArr) => {
          fileArr.forEach((file) => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        });
      }
      return res
        .status(400)
        .json({ success: false, message: "እባክዎ ሁሉንም የግዴታ መስኮች ይሙሉ!" });
    }

    // 3. የፋይል መንገዶችን ማዘጋጀት
    const filePaths = {};
    if (req.files) {
      if (req.files.photo) filePaths.photo = req.files.photo[0].path;
      if (req.files.idCard) filePaths.idCard = req.files.idCard[0].path;
      if (req.files.emergencyPhoto)
        filePaths.emergencyPhoto = req.files.emergencyPhoto[0].path;
    }

    if (!filePaths.photo) {
      return res
        .status(400)
        .json({ success: false, message: "እባክዎ የሼሁን ፎቶ ይጫኑ!" });
    }

    // 4. Array የሆኑ ዳታዎችን ማስተካከል (Subjects & Available Days)
    const parseArray = (data) => {
      if (!data) return [];
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (e) {
        return data.split(",").map((s) => s.trim());
      }
    };

    // 5. ሙሉ የዳታ ዝግጅት
    const teacherData = {
      ...req.body, // ሁሉንም (Address, Education, Emergency Contact ወዘተ) እዚህ ይይዛል
      subjects: parseArray(subjects),
      availableDays: parseArray(availableDays),
      ...filePaths,
    };

    const teacher = await Teacher.create(teacherData);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach((fileArr) => {
        fileArr.forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
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
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "መምህሩ አልተገኘም" });
    }

    let updateData = { ...req.body };

    // Subjects ማስተካከያ
    if (req.body.subjects) {
      try {
        updateData.subjects =
          typeof req.body.subjects === "string"
            ? JSON.parse(req.body.subjects)
            : req.body.subjects;
      } catch (e) {
        updateData.subjects = req.body.subjects.split(",").map((s) => s.trim());
      }
    }

    // አዳዲስ ፋይሎች ከተላኩ አሮጌዎቹን አጥፍቶ አዲሶቹን መመዝገብ
    if (req.files) {
      const fields = ["photo", "idCard", "emergencyPhoto"];
      fields.forEach((field) => {
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
      Object.values(req.files).forEach((fileArr) => {
        fileArr.forEach((file) => fs.unlinkSync(file.path));
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================================
   DELETE TEACHER
========================================================= */
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: "አልተገኘም" });

    // ሁሉንም ፋይሎች (ፎቶ፣ መታወቂያ፣ የተጠሪ ፎቶ) ማጥፋት
    const fields = ["photo", "idCard", "emergencyPhoto"];
    fields.forEach((field) => {
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
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher)
      return res.status(404).json({ success: false, message: "አልተገኘም" });
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
