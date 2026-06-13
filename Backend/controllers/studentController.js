import { getDoc, getDocs, addDoc, setDoc, deleteDoc, findOne, generateId, collections } from "../utils/firestore.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await getDocs(collections.students, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: "ተማሪዎችን ማምጣት አልተቻለም", error: err.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { uploadedUrls, uploadedFiles, fileUrl, subjects, email, ...rest } = req.body;
    const studentExists = await findOne(collections.students, "email", email);
    if (studentExists) {
      return res.status(400).json({ success: false, message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል" });
    }
    const studentData = { ...rest, email };
    if (subjects) {
      try {
        studentData.subjects = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
      } catch { studentData.subjects = []; }
    } else {
      studentData.subjects = [];
    }
    if (studentData.photo === undefined) studentData.photo = "";
    if (studentData.studentIDPhoto === undefined) studentData.studentIDPhoto = "";
    if (studentData.emergencyIDPhoto === undefined) studentData.emergencyIDPhoto = "";
    studentData.studentID = await generateId(collections.students, "S");
    const student = await addDoc(collections.students, studentData);
    res.status(201).json({ success: true, message: `ተማሪው በቁጥር ${student.studentID} ተመዝግቧል`, data: student });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message || "ምዝገባ አልተሳካም" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await getDoc(collections.students, req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const current = await getDoc(collections.students, req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });
    const { uploadedUrls, uploadedFiles, fileUrl, ...cleanData } = req.body;
    let updateData = { ...cleanData };
    if (updateData.subjects) {
      try {
        updateData.subjects = typeof updateData.subjects === "string"
          ? JSON.parse(updateData.subjects) : updateData.subjects;
      } catch {}
    }
    ["photo", "studentIDPhoto", "emergencyIDPhoto"].forEach((f) => {
      if (updateData[f] === undefined) {
        updateData[f] = current[f] || "";
      }
    });
    await setDoc(collections.students, req.params.id, updateData);
    const student = await getDoc(collections.students, req.params.id);
    res.status(200).json({ success: true, message: "የተማሪው መረጃ ታድሷል", data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await getDoc(collections.students, req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });
    await deleteDoc(collections.students, req.params.id);
    res.status(200).json({ success: true, message: "ተማሪው ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await getDocs(collections.enrollments, {
      where: [{ field: "studentId", op: "==", value: req.params.id }],
    });
    const courseIds = enrollments.map((e) => e.courseId);
    const allCourses = await getDocs(collections.courses);
    const courses = allCourses.filter((c) => courseIds.includes(c.id));
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
