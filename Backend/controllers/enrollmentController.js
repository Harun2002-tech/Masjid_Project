import { getDoc, getDocs, addDoc, setDoc, deleteDoc, findOne, collections } from "../utils/firestore.js";
import notifyEmail from "../utils/notify.js";

export const submitEnrollment = async (req, res) => {
  try {
    const { nationalId, course, phone, fullName, gender } = req.body;
    const targetCourse = await getDoc(collections.courses, course);
    if (!targetCourse) return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም!" });
    if (targetCourse.enrollmentOpen === false) {
      return res.status(400).json({ success: false, message: "ይቅርታ፣ የዚህ ኮርስ ምዝገባ ተዘግቷል።" });
    }

    const idCardImage = req.body.idCardImage || "";
    const newEnrollment = await addDoc(collections.enrollments, {
      fullName, nationalId, phone, gender,
      course, user: req.user.id,
      idCardImage,
      applicationStatus: "pending",
      courseStatus: "active", paymentStatus: "unpaid",
      progress: 0, completedLessons: [],
    });

    // Non-blocking confirmation email.
    notifyEmail({
      email: req.user.email,
      subject: "የምዝገባ ጥያቄዎ ደርሶናል - Ruhama Academy",
      html: `<div style="font-family:sans-serif;direction:rtl;text-align:right;border:1px solid #eee;padding:20px;">
        <h2 style="color:#064e3b;">ሰላም ${fullName}፣</h2>
        <p>ለ <b>${targetCourse.title}</b> ኮርስ ያቀረቡት የምዝገባ ጥያቄ ደርሶናል።</p>
        <p>አድሚኑ መረጃዎን መርምሮ ሲያጸድቅ እናሳውቅዎታለን።</p>
        <br/><p>መልካም ጊዜ!<br/>Ruhama Academy</p></div>`,
    });

    res.status(201).json({
      success: true,
      message: "ማመልከቻዎ ተልኳል፤ አድሚኑ እስኪያጸድቅልዎ ይጠብቁ።",
      data: newEnrollment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await getDocs(collections.enrollments, { orderBy: "createdAt", orderDir: "desc" });
    const enriched = await Promise.all(enrollments.map(async (e) => {
      let userData = null, courseData = null;
      try {
        if (e.user) userData = await getDoc(collections.users, e.user);
      } catch {}
      try {
        if (e.course) courseData = await getDoc(collections.courses, e.course);
      } catch {}
      return { ...e, user: userData ? { id: userData.id, name: userData.name, email: userData.email } : e.user, course: courseData ? { id: courseData.id, title: courseData.title } : e.course };
    }));
    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: "መረጃ ማምጣት አልተቻለም" });
  }
};

export const approveEnrollment = async (req, res) => {
  try {
    const enrollment = await getDoc(collections.enrollments, req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    await setDoc(collections.enrollments, req.params.id, { applicationStatus: "approved" });
    const updated = await getDoc(collections.enrollments, req.params.id);

    let userData = null;
    try { userData = await getDoc(collections.users, enrollment.user, ["email", "name"]); } catch {}
    if (userData) {
      // Non-blocking approval email.
      notifyEmail({
        email: userData.email,
        subject: "እንኳን ደስ አለዎት! የምዝገባ ጥያቄዎ ጸድቋል",
        html: `<div style="font-family:sans-serif;direction:rtl;text-align:right;border:2px solid #064e3b;padding:20px;border-radius:15px;">
          <h2 style="color:#064e3b;">እንኳን ደስ አለዎት!</h2>
          <p>ሰላም <b>${enrollment.fullName}</b>፣</p>
          <p>ለ Ruhama Academy ያቀረቡት የምዝገባ ጥያቄ ተቀባይነት አግኝቷል።</p>
          <br/><p>ከሰላምታ ጋር፣<br/>Ruhama Academy</p></div>`,
      });
    }

    res.status(200).json({ success: true, message: "ማመልከቻው ጸድቋል", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectEnrollment = async (req, res) => {
  try {
    const enrollment = await getDoc(collections.enrollments, req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    await setDoc(collections.enrollments, req.params.id, { applicationStatus: "rejected" });
    const updated = await getDoc(collections.enrollments, req.params.id);
    res.status(200).json({ success: true, message: "ማመልከቻው ውድቅ ተደርጓል", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const { courseId } = req.params;
    const enrollments = await getDocs(collections.enrollments, {
      where: [
        { field: "user", op: "==", value: req.user.id },
        { field: "course", op: "==", value: courseId },
        { field: "applicationStatus", op: "==", value: "approved" },
      ],
    });
    if (enrollments.length === 0) return res.status(404).json({ success: false, message: "ንቁ ምዝገባ አልተገኘም" });

    const enrollment = enrollments[0];
    if (!enrollment.completedLessons?.includes(lessonId)) {
      const completed = [...(enrollment.completedLessons || []), lessonId];
      const course = await getDoc(collections.courses, courseId);
      const progress = course?.lessons?.length > 0
        ? Math.round((completed.length / course.lessons.length) * 100) : 0;
      await setDoc(collections.enrollments, enrollment.id, { completedLessons: completed, progress });
    }
    const updated = await getDoc(collections.enrollments, enrollment.id);
    res.status(200).json({ success: true, progress: updated.progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await getDocs(collections.enrollments, {
      where: [{ field: "user", op: "==", value: req.user.id }],
      orderBy: "createdAt", orderDir: "desc",
    });
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentStatus = async (req, res) => {
  try {
    const enrollments = await getDocs(collections.enrollments, {
      where: [
        { field: "user", op: "==", value: req.user.id },
        { field: "course", op: "==", value: req.params.courseId },
      ],
    });
    if (enrollments.length === 0) return res.status(200).json({ success: true, status: null });
    res.status(200).json({ success: true, status: enrollments[0].applicationStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    await setDoc(collections.enrollments, req.params.id, req.body);
    const enrollment = await getDoc(collections.enrollments, req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    await deleteDoc(collections.enrollments, req.params.id);
    res.status(200).json({ success: true, message: "ምዝገባው ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
