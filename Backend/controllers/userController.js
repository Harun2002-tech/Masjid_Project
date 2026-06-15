import jwt from "jsonwebtoken";
import {
  getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  findOne, hashPassword, comparePassword, collections
} from "../utils/firestore.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: (user.role || "").toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const getAdmins = async (req, res) => {
  try {
    const all = await getDocs(collections.users);
    const admins = all.filter((u) =>
      ["admin", "superadmin", "masjid_admin"].includes((u.role || "").toLowerCase())
    ).map(({ password, ...rest }) => rest);
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getDoc(collections.users, req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "ተጠቃሚው አልተገኘም" });
    const { password, ...rest } = user;
    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    const exists = await findOne(collections.users, "email", cleanEmail);
    if (exists) {
      return res.status(400).json({ success: false, message: "ይህ ኢሜይል ቀድሞ ተመዝግቧል" });
    }

    const hashed = await hashPassword(password);
    const user = await addDoc(collections.users, {
      name, email: cleanEmail, password: hashed,
      role: role ? role.toLowerCase() : "student",
      isActive: true, profilePicture: "",
    });

    const nameArray = name.trim().split(/\s+/);
    const profileData = {
      user: user.id, firstName: nameArray[0],
      lastName: nameArray.slice(1).join(" ") || "",
      email: user.email, phone: phone || "0900000000",
    };

    if (user.role === "student") {
      await addDoc(collections.students, profileData);
    } else if (user.role === "teacher") {
      await addDoc(collections.teachers, profileData);
    }

    res.status(201).json({
      success: true, message: "ምዝገባው ተሳክቷል",
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "እባክዎ ፎቶ ይምረጡ" });
    }
    const imageUrl = req.body.profilePicture || req.body.fileUrl || "";
    if (!imageUrl) {
      return res.status(500).json({ success: false, message: "የፎቶ ጭነት አልተሳካም።" });
    }
    await setDoc(collections.users, req.user.id, { profilePicture: imageUrl });
    const user = await getDoc(collections.users, req.user.id);
    const { password, ...rest } = user;
    res.status(200).json({ success: true, message: "Profile picture updated successfully", user: rest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne(collections.users, "email", email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: "ኢሜይል ወይም ፓስወርድ ተሳስቷል" });
    }
    if (user.isActive === false) {
      return res.status(401).json({ success: false, message: "አካውንትዎ ለጊዜው ታግዷል" });
    }
    res.status(200).json({
      success: true, token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    await setDoc(collections.users, req.user.id, { name, email });
    const user = await getDoc(collections.users, req.user.id);
    const { password, ...rest } = user;
    res.status(200).json({ success: true, message: "መረጃዎ ታድሷል", data: rest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await getDoc(collections.users, req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "ተጠቃሚው አልተገኘም" });
    if (!(await comparePassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({ success: false, message: "የድሮው ፓስወርድ ስህተት ነው" });
    }
    const hashed = await hashPassword(req.body.newPassword);
    await setDoc(collections.users, req.user.id, { password: hashed });
    res.status(200).json({ success: true, message: "ፓስወርድ ተቀይሯል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await getDoc(collections.users, id);
    if (!admin) return res.status(404).json({ success: false, message: "አስተዳዳሪው አልተገኘም" });
    if (admin.id === req.user.id) {
      return res.status(400).json({ success: false, message: "የራስዎን አካውንት ማጥፋት አይችሉም" });
    }
    await deleteDoc(collections.users, id);
    res.status(200).json({ success: true, message: "አስተዳዳሪው ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
    }
    await setDoc(collections.users, id, updateData);
    const admin = await getDoc(collections.users, id);
    const { password: _, ...rest } = admin;
    res.status(200).json({ success: true, message: "ተሻሽሏል", data: rest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
