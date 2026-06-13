import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const createCourse = async (req, res) => {
  try {
    let courseData = { ...req.body };
    if (courseData.lessons && typeof courseData.lessons === "string") {
      try { courseData.lessons = JSON.parse(courseData.lessons); }
      catch { return res.status(400).json({ success: false, message: "Lessons JSON format error" }); }
    }
    if (req.body.uploadedFiles) {
      const files = typeof req.body.uploadedFiles === "string"
        ? JSON.parse(req.body.uploadedFiles) : req.body.uploadedFiles;
      if (files.thumbnail) courseData.thumbnail = files.thumbnail;
    }
    const newCourse = await addDoc(collections.courses, courseData);
    res.status(201).json({ success: true, message: "ኮርሱ በትክክል ተፈጥሯል", data: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await getDocs(collections.courses, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await getDoc(collections.courses, req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dayNumber, youtubeUrl } = req.body;
    const course = await getDoc(collections.courses, id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });

    const newLesson = {
      id: Date.now().toString(),
      title: title || "",
      description: description || "",
      dayNumber: Number(dayNumber) || 1,
      youtubeUrl: youtubeUrl || "",
      videoUrl: req.body.videoUrl || req.body.video || "",
      audioUrl: req.body.audioUrl || req.body.audio || "",
      pdfUrl: req.body.pdfUrl || req.body.pdf || "",
      createdAt: new Date().toISOString(),
    };

    const lessons = [...(course.lessons || []), newLesson];
    await setDoc(collections.courses, id, { lessons });
    const updated = await getDoc(collections.courses, id);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const course = await getDoc(collections.courses, id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });

    const lessons = (course.lessons || []).map((l) => {
      if (l.id === lessonId) {
        return { ...l, ...req.body };
      }
      return l;
    });
    await setDoc(collections.courses, id, { lessons });
    const updated = await getDoc(collections.courses, id);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const course = await getDoc(collections.courses, id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });

    const lessons = (course.lessons || []).filter((l) => l.id !== lessonId);
    await setDoc(collections.courses, id, { lessons });
    const updated = await getDoc(collections.courses, id);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.body.uploadedFiles) {
      const files = typeof req.body.uploadedFiles === "string"
        ? JSON.parse(req.body.uploadedFiles) : req.body.uploadedFiles;
      if (files.thumbnail) updatedData.thumbnail = files.thumbnail;
    }
    await setDoc(collections.courses, req.params.id, updatedData);
    const course = await getDoc(collections.courses, req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await getDoc(collections.courses, req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    await deleteDoc(collections.courses, req.params.id);
    res.status(200).json({ success: true, message: "ኮርሱ በትክክል ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await getDocs(collections.enrollments, {
      where: [{ field: "userId", op: "==", value: req.user.id }],
    });
    const courseIds = enrollments.filter((e) => e.applicationStatus === "approved").map((e) => e.courseId || e.course);
    const allCourses = await getDocs(collections.courses);
    const myCourses = allCourses.filter((c) => courseIds.includes(c.id));
    res.status(200).json({ success: true, count: myCourses.length, data: myCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleEnrollmentStatus = async (req, res) => {
  try {
    const course = await getDoc(collections.courses, req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });
    const newStatus = !course.enrollmentOpen;
    await setDoc(collections.courses, req.params.id, { enrollmentOpen: newStatus });
    res.status(200).json({
      success: true,
      message: `ምዝገባው በትክክል ${newStatus ? "ተከፍቷል" : "ተዘግቷል"}`,
      enrollmentOpen: newStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
