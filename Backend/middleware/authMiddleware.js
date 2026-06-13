import jwt from "jsonwebtoken";
import { getDoc, collections } from "../utils/firestore.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getDoc(collections.users, decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: "ይህ ተጠቃሚ በሲስተሙ ውስጥ የለም" });
      }
      if (user.isActive === false) {
        return res.status(401).json({ success: false, message: "አካውንትዎ ለጊዜው ታግዷል" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      let message = "ቶከኑ ልክ አይደለም";
      if (error.name === "TokenExpiredError") {
        message = "ቶከኑ ጊዜው አልፏል፣ እባክዎ እንደገና ይግቡ";
      }
      return res.status(401).json({ success: false, message });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "ይህንን ተግባር ለማከናወን መጀመሪያ መግባት አለብዎት" });
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: "የተጠቃሚው ስልጣን አልተለየም" });
    }
    const userRole = req.user.role.toLowerCase();
    const isAllowed = roles.some((role) => role.toLowerCase() === userRole);
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: `ይህንን ገጽ ለመጠቀም ፈቃድ የለዎትም። የሚያስፈልግ ስልጣን፡ ${roles.join(" ወይም ")}`,
      });
    }
    next();
  };
};
