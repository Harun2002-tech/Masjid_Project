import express from "express";
const router = express.Router();

import {
  getMyAchievements,
  createAchievement,
} from "../controllers/achievementController.js"; // 👈 .js መጨመር እንዳትረሳ

import { protect, allowRoles } from "../middleware/authMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/**
 * 1. ተጠቃሚዎች የራሳቸውን ስኬት ብቻ እንዲያዩ
 */
router.get("/", protect, getMyAchievements);

/**
 * 2. አዲስ ስኬት ለመጨመር (ለአድሚኖች ብቻ የተፈቀደ)
 * ማሳሰቢያ፦ ተራ ተጠቃሚ እንዲጨምር ከፈለግክ allowRoles የሚለውን አውጣው
 */
router.post("/", protect, allowRoles(...adminRoles), createAchievement);

export default router;
