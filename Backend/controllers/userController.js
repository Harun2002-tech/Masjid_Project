import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import jwt from "jsonwebtoken";

// ... (ሌሎች imports እንዳሉ ሆነው)

// 🔑 Token ማመንጫ (ተጨማሪ መረጃዎችን አካትቻለሁ)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role.toLowerCase() }, // 🚀 ሮሉን ወደ lowercase ቀይረን እንላከው
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 7. ሁሉንም አድሚኖች ለማምጣት (የተስተካከለ) 🚀
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      // 💡 ማስተካከያ፦ ከዳታቤዝህ enum ጋር እንዲጣጣም በትናንሽ ፊደላት ተተክቷል
      role: { $in: ["admin", "superadmin", "masjid_admin"] },
    }).select("-password");

    // ለ React ምቾት እንዲሰጠው success: true መጨመር ይመረጣል
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. የራስን ፕሮፋይል ማየት (ለተጨማሪ ጥንቃቄ)
export const getMe = async (req, res) => {
  try {
    // req.user.id የሚመጣው ከ protect middleware ነው
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "ተጠቃሚው አልተገኘም" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 1. መመዝገብ (REGISTER) - 'next' ሙሉ በሙሉ ተወግዷል 🚀
export const register = async (req, res) => {
  // 👈 እዚህ ጋር 'next' መኖሩ የግድ አይደለም
  try {
    const { name, email, password, role, phone } = req.body;

    // 1. ኢሜይሉን ወደ lowercase መቀየር
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል",
      });
    }

    // 2. ተጠቃሚውን መፍጠር
    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: role ? role.toLowerCase() : "student",
    });

    // 3. ስሙን ለፕሮፋይል መከፋፈል
    const nameArray = user.name.trim().split(/\s+/);
    const profileData = {
      user: user._id,
      firstName: nameArray[0],
      lastName: nameArray.slice(1).join(" ") || "",
      email: user.email,
      phone: phone || "0900000000",
    };

    // 4. እንደ ተጠቃሚው ሮል ፕሮፋይል መፍጠር (Student ወይም Teacher)
    // እዚህ ጋር Model መኖሩን እና Import መደረጉን አረጋግጥ
    if (user.role === "student") {
      if (typeof Student !== "undefined") await Student.create(profileData);
    } else if (user.role === "teacher") {
      if (typeof Teacher !== "undefined") await Teacher.create(profileData);
    }

    // ስኬታማ ሲሆን
    return res.status(201).json({
      success: true,
      message: "ምዝገባው ተሳክቷል",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // 1. መጀመሪያ በ Render Logs ላይ ስህተቱን ለማየት
    console.error("ትክክለኛው የሰርቨር ስህተት ይሄ ነው:", error);

    // 2. ለ Postman መልስ ለመስጠት (next(error) አንጠቀምም!)
    return res.status(500).json({
      success: false,
      message: "በሰርቨሩ ላይ ስህተት ተከስቷል",
      error: error.message, // 👈 አሁን ትክክለኛውን የ MongoDB ስህተት ያሳይሃል
    });
  }
};

// 2. ፕሮፋይል ፎቶ መቀየር (UPDATE PROFILE PICTURE)
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "እባክዎ ፎቶ ይምረጡ (Please upload a file)",
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imagePath },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Picture Error:", error);
    res.status(500).json({
      success: false,
      message: "ፎቶውን መቀየር አልተቻለም (Server Error)",
    });
  }
};

// 3. መግባት (LOGIN)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "ኢሜይል ወይም ፓስወርድ ተሳስቷል" });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. መረጃ ማሻሻል
export const updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "መረጃዎ ታድሷል", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6. ፓስወርድ መቀየር
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "ተጠቃሚው አልተገኘም" });
    }

    // አሁን matchPassword ይሰራል
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "የድሮው ፓስወርድ ስህተት ነው" });
    }

    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({ success: true, message: "ፓስወርድ ተቀይሯል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. አስተዳዳሪን ማጥፋት
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "አስተዳዳሪው አልተገኘም" });
    }
    if (admin._id.toString() === req.user.id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "የራስዎን አካውንት ማጥፋት አይችሉም" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "አስተዳዳሪው በተሳካ ሁኔታ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. የአስተዳዳሪ መረጃ ማሻሻል
export const editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const admin = await User.findById(id).select("+password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "አስተዳዳሪው አልተገኘም" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (password && password.trim() !== "") {
      admin.password = password;
    }

    await admin.save();
    res.status(200).json({
      success: true,
      message: "የአስተዳዳሪው መረጃ ተሻሽሏል",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
