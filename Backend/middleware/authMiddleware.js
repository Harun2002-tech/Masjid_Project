import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 1. ቶከን ማረጋገጫ (PROTECT)
 * ተጠቃሚው ትክክለኛ JWT ቶከን ማቅረቡን እና በሲስተሙ ውስጥ መኖሩን ያረጋግጣል
 */
export const protect = async (req, res, next) => {
  let token;

  // ቶከኑ በ Authorization Header መኖሩን ቼክ ማድረግ
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ቶከኑን ከ "Bearer <token>" ነጥሎ ማውጣት
      token = req.headers.authorization.split(" ")[1];

      // ቶከኑን በድብቅ ቁልፉ (JWT_SECRET) ማረጋገጥ
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // በቶከኑ ውስጥ ባለው ID ተጠቃሚውን መፈለግ
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "ይህ ተጠቃሚ በሲስተሙ ውስጥ የለም",
        });
      }

      // ተጠቃሚው ገባሪ (Active) መሆኑን ማረጋገጥ
      if (req.user.isActive === false) {
        return res.status(401).json({
          success: false,
          message: "አካውንትዎ ለጊዜው ታግዷል",
        });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      let message = "ቶከኑ ልክ አይደለም (Not authorized)";
      
      if (error.name === "TokenExpiredError") {
        message = "ቶከኑ ጊዜው አልፏል፣ እባክዎ እንደገና ይግቡ";
      }
      
      return res.status(401).json({ success: false, message });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "ይህንን ተግባር ለማከናወን መጀመሪያ መግባት አለብዎት",
    });
  }
};

/**
 * 2. የሮል ማረጋገጫ (ALLOW ROLES)
 * ተጠቃሚው ለተወሰኑ ተግባራት የተፈቀደለት Role እንዳለው ያረጋግጣል
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "የተጠቃሚው ስልጣን አልተለየም",
      });
    }

    // 💡 ማስተካከያ፡ በካፒታልም በትንሽም ቢጻፍ እንዲያልፍ ያደርገዋል (Case-insensitive check)
    const userRole = req.user.role.toLowerCase();
    const isAllowed = roles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: `ይህንን ገጽ ለመጠቀም ፈቃድ የለዎትም። የሚያስፈልግ ስልጣን፡ ${roles.join(" ወይም ")}`,
      });
    }

    next();
  };
};