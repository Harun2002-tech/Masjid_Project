const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const sendEmail = require("../utils/sendEmail"); // 👈 ይህ መኖሩን እርግጠኛ ሁን
/* =====================================================
   1. Submit Enrollment (ተማሪው ሲያመለክት ከደህንነት ጥበቃ ጋር)
===================================================== */
exports.submitEnrollment = async (req, res) => {
  try {
    const { nationalId, course, phone, fullName, gender } = req.body;

    // 1. መጀመሪያ ኮርሱን መፈለግ
    const targetCourse = await Course.findById(course);
    if (!targetCourse) {
      return res.status(404).json({ success: false, message: "ኮርሱ አልተገኘም!" });
    }

    // 2. 🛡️ የደህንነት መቆለፊያ (Backend Lock)
    if (targetCourse.enrollmentOpen === false) {
      return res.status(400).json({
        success: false,
        message: "ይቅርታ፣ የዚህ ኮርስ ምዝገባ በአሁኑ ሰዓት በአድሚኑ ተዘግቷል።",
      });
    }

    // 3. ፋይል መኖሩን ማረጋገጥ
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "እባክዎ የመታወቂያ ፎቶ ይስቀሉ" });
    }

    const imagePath = req.file.path.replace(/\\/g, "/");

    // 4. ምዝገባውን መፍጠር
    const newEnrollment = await Enrollment.create({
      fullName,
      nationalId,
      phone,
      gender,
      course: course,
      user: req.user.id,
      idCardImage: imagePath,
      applicationStatus: "pending",
    });

    // 📧 ኢሜይል ማሳወቂያ
    try {
      await sendEmail({
        email: req.user.email,
        subject: "የምዝገባ ጥያቄዎ ደርሶናል - Ruhama Academy",
        html: `
          <div style="font-family: sans-serif; direction: rtl; text-align: right; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #064e3b;">ሰላም ${fullName}፣</h2>
            <p>ለ <b>${targetCourse.title}</b> ኮርስ ያቀረቡት የምዝገባ ጥያቄ በትክክል ደርሶናል።</p>
            <p>አድሚኑ መረጃዎን መርምሮ ሲያጸድቅ በኢሜይል እናሳውቅዎታለን።</p>
            <br />
            <p>መልካም ጊዜ!<br />Ruhama Academy</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email Sending Failed:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "ማመልከቻዎ በተሳካ ሁኔታ ተልኳል፤ አድሚኑ እስኪያጸድቅልዎ ይጠብቁ።",
      data: newEnrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "ለዚህ ኮርስ ቀደም ብለው አመልክተዋል።" });
    }
    console.error("SUBMIT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
/* =====================================================
   2. Get All Enrollments (ለአድሚን ዳሽቦርድ)
===================================================== */
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: "መረጃ ማምጣት አልተቻለም" });
  }
};

/* =====================================================
   3. Approve Enrollment (አድሚኑ ሲያጸድቅ)
===================================================== */
exports.approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { applicationStatus: "approved" },
      { new: true }
    ).populate("user", "email name");

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    }

    // 📧 የ "እንኳን ደስ አለዎት" ኢሜይል
    try {
      await sendEmail({
        email: enrollment.user.email,
        subject: "እንኳን ደስ አለዎት! የምዝገባ ጥያቄዎ ጸድቋል",
        html: `
          <div style="font-family: sans-serif; direction: rtl; text-align: right; border: 2px solid #064e3b; padding: 20px; border-radius: 15px;">
            <h2 style="color: #064e3b;">እንኳን ደስ አለዎት!</h2>
            <p>ሰላም <b>${enrollment.fullName}</b>፣</p>
            <p>ለ <b>Ruhama Academy</b> ያቀረቡት የምዝገባ ጥያቄ ተቀባይነት አግኝቷል። አሁን ትምህርትዎን መጀመር ይችላሉ።</p>
            <br />
            <p>ከሰላምታ ጋር፣<br />Ruhama Academy</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Approval Email Failed:", emailErr);
    }

    res.status(200).json({
      success: true,
      message: "ማመልከቻው ጸድቋል፤ ተማሪው ትምህርት መጀመር ይችላል።",
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =====================================================
   4. Reject Enrollment (አድሚኑ ውድቅ ሲያደርግ)
===================================================== */
exports.rejectEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { applicationStatus: "rejected" },
      { new: true }
    );

    if (!enrollment)
      return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });

    res
      .status(200)
      .json({ success: true, message: "ማመልከቻው ውድቅ ተደርጓል", data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =====================================================
   5. Update Student Progress
===================================================== */
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
      applicationStatus: "approved",
    });

    if (!enrollment)
      return res
        .status(404)
        .json({ success: false, message: "ንቁ የሆነ የምዝገባ መረጃ አልተገኘም" });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      const course = await Course.findById(courseId);
      if (course?.lessons?.length > 0) {
        enrollment.progress = Math.round(
          (enrollment.completedLessons.length / course.lessons.length) * 100
        );
      }
      await enrollment.save();
    }

    res.status(200).json({ success: true, progress: enrollment.progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   6. Get My Enrollments (ለተማሪው ዳሽቦርድ)
===================================================== */
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate("course", "title thumbnail teacher")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/* =====================================================
   9. Get Enrollment Status (ለተማሪው በኮርስ ID)
===================================================== */
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id, // የገባው ተማሪ ID
      course: req.params.courseId, // ከ URL የመጣው Course ID
    });

    if (!enrollment) {
      return res.status(200).json({ success: true, status: null });
    }

    res.status(200).json({
      success: true,
      status: enrollment.applicationStatus, // "pending", "approved", "rejected"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/* =====================================================
   7. Update & 8. Delete
===================================================== */
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment)
      return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment)
      return res.status(404).json({ success: false, message: "ምዝገባው አልተገኘም" });
    res.status(200).json({ success: true, message: "ምዝገባው በተሳካ ሁኔታ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
