import { getDoc, getDocs, addDoc, setDoc, deleteDoc, findOne, generateId, collections } from "../utils/firestore.js";
import sendEmail from "../utils/sendEmail.js";

// 🚀 አድሚን በቀጥታ ተማሪ ሲመዘግብ (ወዲያውኑ የጸደቀ ይሆናል)
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

    // 👇 አድሚን ራሱ ስለሚመዘግብ ወዲያውኑ የጸደቀ (approved) ይደረጋል
    studentData.applicationStatus = "approved";
    studentData.approvedBy = req.user?.id || null;
    studentData.approvedAt = new Date().toISOString();
    studentData.studentID = await generateId(collections.students, "S");

    const student = await addDoc(collections.students, studentData);
    res.status(201).json({ success: true, message: `ተማሪው በቁጥር ${student.studentID} ተመዝግቧል`, data: student });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message || "ምዝገባ አልተሳካም" });
  }
};

// 🆕 ተጠቃሚው/ተማሪው ራሱ የምዝገባ ጥያቄ ሲያስገባ (pending ሆኖ ይቀመጣል)
export const applyAsStudent = async (req, res) => {
  try {
    const { uploadedUrls, uploadedFiles, fileUrl, subjects, email, ...rest } = req.body;

    const studentExists = await findOne(collections.students, "email", email);
    if (studentExists) {
      return res.status(400).json({ success: false, message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል ወይም ማመልከቻ አስገብቷል" });
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

    // 👇 ራስን ማመልከት ሁልጊዜ pending ነው፣ studentID እስኪጸድቅ ድረስ አይመደብም
    studentData.applicationStatus = "pending";
    studentData.submittedBy = req.user?.id || null;
    studentData.studentID = "";

    const student = await addDoc(collections.students, studentData);

    try {
      if (req.user?.email) {
        await sendEmail({
          email: req.user.email,
          subject: "የተማሪ ምዝገባ ጥያቄዎ ደርሶናል - Ruhama Academy",
          html: `<div style="font-family:sans-serif;direction:rtl;text-align:right;border:1px solid #eee;padding:20px;">
            <h2 style="color:#064e3b;">ሰላም ${studentData.firstName || ""}፣</h2>
            <p>የተማሪ ምዝገባ ጥያቄዎ ደርሶናል።</p>
            <p>አድሚኑ መረጃዎን መርምሮ ሲያጸድቅ በኢሜል እናሳውቅዎታለን።</p>
            <br/><p>መልካም ጊዜ!<br/>Ruhama Academy</p></div>`,
        });
      }
    } catch (emailErr) { console.error("Email Failed:", emailErr); }

    res.status(201).json({
      success: true,
      message: "ማመልከቻዎ ተልኳል፤ አድሚኑ እስኪያጸድቅልዎ ይጠብቁ።",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message || "ማመልከቻው አልተሳካም" });
  }
};

// ✅ አድሚን ማመልከቻን ሲያጸድቅ (studentID እዚህ ጋር ይመደባል)
export const approveStudent = async (req, res) => {
  try {
    const student = await getDoc(collections.students, req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });

    let studentID = student.studentID;
    if (!studentID) {
      studentID = await generateId(collections.students, "S");
    }

    await setDoc(collections.students, req.params.id, {
      applicationStatus: "approved",
      studentID,
      approvedBy: req.user?.id || null,
      approvedAt: new Date().toISOString(),
      rejectionReason: "",
    });
    const updated = await getDoc(collections.students, req.params.id);

    try {
      if (updated.email) {
        await sendEmail({
          email: updated.email,
          subject: "እንኳን ደስ አለዎት! የተማሪ ምዝገባዎ ጸድቋል - Ruhama Academy",
          html: `<div style="font-family:sans-serif;direction:rtl;text-align:right;border:2px solid #064e3b;padding:20px;border-radius:15px;">
            <h2 style="color:#064e3b;">እንኳን ደስ አለዎት!</h2>
            <p>ሰላም <b>${updated.firstName || ""}</b>፣</p>
            <p>የተማሪ ምዝገባዎ ተቀባይነት አግኝቷል። የተማሪ መታወቂያ ቁጥርዎ፦ <b>${studentID}</b></p>
            <br/><p>ከሰላምታ ጋር፣<br/>Ruhama Academy</p></div>`,
        });
      }
    } catch (emailErr) { console.error("Approval Email Failed:", emailErr); }

    res.status(200).json({ success: true, message: `ተማሪው ጸድቋል፣ ID: ${studentID}`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ አድሚን ማመልከቻን ሲያግድ/ሲቀበል
export const rejectStudent = async (req, res) => {
  try {
    const student = await getDoc(collections.students, req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "ተማሪው አልተገኘም" });

    const { reason } = req.body;
    await setDoc(collections.students, req.params.id, {
      applicationStatus: "rejected",
      rejectionReason: reason || "",
      rejectedBy: req.user?.id || null,
      rejectedAt: new Date().toISOString(),
    });
    const updated = await getDoc(collections.students, req.params.id);

    try {
      if (updated.email) {
        await sendEmail({
          email: updated.email,
          subject: "የተማሪ ምዝገባ ጥያቄዎ ውጤት - Ruhama Academy",
          html: `<div style="font-family:sans-serif;direction:rtl;text-align:right;border:1px solid #eee;padding:20px;">
            <h2 style="color:#991b1b;">ማመልከቻዎ ተመልክቷል</h2>
            <p>ሰላም <b>${updated.firstName || ""}</b>፣</p>
            <p>ይቅርታ፣ በአሁኑ ወቅት ማመልከቻዎ ተቀባይነት አላገኘም።${reason ? ` ምክንያት: ${reason}` : ""}</p>
            <br/><p>ከሰላምታ ጋር፣<br/>Ruhama Academy</p></div>`,
        });
      }
    } catch (emailErr) { console.error("Rejection Email Failed:", emailErr); }

    res.status(200).json({ success: true, message: "ማመልከቻው ውድቅ ተደርጓል", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 ተጠቃሚው የራሱን ማመልከቻ/ደረጃ እንዲያይ
export const getMyApplications = async (req, res) => {
  try {
    const students = await getDocs(collections.students, {
      where: [{ field: "submittedBy", op: "==", value: req.user.id }],
      orderBy: "createdAt", orderDir: "desc",
    });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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