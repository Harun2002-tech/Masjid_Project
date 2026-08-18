import { getDoc, getDocs, addDoc, setDoc, deleteDoc, findOne, generateId, collections } from "../utils/firestore.js";

const TEACHER_LIST_FIELDS = [
  "firstName", "lastName", "email", "phone", "photo", "teacherID",
  "subjects", "experienceYears", "rating", "isActive", "createdAt",
];

export const createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, bio, password, subjects, availableDays, experienceYears } = req.body;
    if (!firstName || !lastName || !email || !phone || !bio || !password || !experienceYears) {
      return res.status(400).json({ success: false, message: "እባክዎ ሁሉንም የግዴታ መስኮች ይሙሉ!" });
    }
    const exists = await findOne(collections.teachers, "email", email);
    if (exists) return res.status(400).json({ success: false, message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል!" });

    const parseArray = (data) => {
      if (!data) return [];
      try { return typeof data === "string" ? JSON.parse(data) : data; }
      catch { return data.split(",").map((s) => s.trim()); }
    };

    const { uploadedUrls, uploadedFiles, fileUrl, ...rest } = req.body;
    const teacherData = {
      ...rest, subjects: parseArray(subjects), availableDays: parseArray(availableDays),
      teacherID: await generateId(collections.teachers, "T"), isActive: true, rating: 0,
    };
    if (teacherData.photo === undefined) teacherData.photo = "";
    if (teacherData.idCard === undefined) teacherData.idCard = "";
    if (teacherData.emergencyPhoto === undefined) teacherData.emergencyPhoto = "";

    const teacher = await addDoc(collections.teachers, teacherData);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await getDoc(collections.teachers, req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "መምህሩ አልተገኘም" });

    const { uploadedUrls, uploadedFiles, fileUrl, ...cleanData } = req.body;
    let updateData = { ...cleanData };
    if (updateData.subjects) {
      try { updateData.subjects = typeof updateData.subjects === "string" ? JSON.parse(updateData.subjects) : updateData.subjects; }
      catch { updateData.subjects = updateData.subjects.split(",").map((s) => s.trim()); }
    }
    ["photo", "idCard", "emergencyPhoto"].forEach((f) => {
      if (updateData[f] === undefined) {
        updateData[f] = teacher[f] || "";
      }
    });
    await setDoc(collections.teachers, req.params.id, updateData);
    const updated = await getDoc(collections.teachers, req.params.id);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await getDoc(collections.teachers, req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "አልተገኘም" });
    await deleteDoc(collections.teachers, req.params.id);
    res.status(200).json({ success: true, message: "የመምህሩ መረጃ ሙሉ በሙሉ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await getDocs(collections.teachers, {
      orderBy: "createdAt",
      orderDir: "desc",
      select: TEACHER_LIST_FIELDS,
    });
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await getDoc(collections.teachers, req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: "አልተገኘም" });
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
