import { getDoc, getDocs, setDoc, collections } from "../utils/firestore.js";
import { db } from "../config/firebase.js";

export const addLesson = async (req, res) => {
  try {
    const { title, description, dayNumber, type } = req.body;
    const { id } = req.params;

    const course = await getDoc(collections.courses, id);
    if (!course) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም" });

    const newLesson = {
      id: Date.now().toString(),
      title: title || "",
      description: description || "",
      type: type || "pdf",
      fileUrl: req.body.fileUrl || "",
      dayNumber: dayNumber || 1,
      createdAt: new Date().toISOString(),
    };

    const lessons = [...(course.lessons || []), newLesson];
    await setDoc(collections.courses, id, { lessons });
    const updated = await getDoc(collections.courses, id);
    res.status(200).json({ success: true, message: "ትምህርቱ ተጨምሯል", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "እባክዎ መጀመሪያ ይግቡ" });
    const enrollments = await getDocs(collections.enrollments, {
      where: [
        { field: "user", op: "==", value: req.user.id },
        { field: "applicationStatus", op: "==", value: "approved" },
      ],
    });
    const courseIds = enrollments.map((e) => e.course || e.courseId);
    const allCourses = await getDocs(collections.courses);
    const myCourses = allCourses.filter((c) => courseIds.includes(c.id));
    res.status(200).json({ success: true, count: myCourses.length, data: myCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
