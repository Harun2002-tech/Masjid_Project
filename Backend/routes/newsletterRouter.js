import express from "express";
const router = express.Router();

import {
  subscribe,
  getAllSubscribers,
} from "../controllers/newsletterController.js"; // 👈 .js መጨመሩን አረጋግጥ

import { protect, allowRoles } from "../middleware/authMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/**
 * 1. ሰብስክራይብ ለማድረግ (ለሁሉም ክፍት ነው)
 */
router.post("/subscribe", subscribe);

/**
 * 2. ሁሉንም ሰብስክራይበሮች ለማየት (ለአድሚኖች ብቻ የተፈቀደ)
 * 🛡️ ደህንነቱን ለመጠበቅ protect እና allowRoles ጨምረናል
 */
router.get(
  "/subscribers",
  protect,
  allowRoles(...adminRoles),
  getAllSubscribers
);

export default router;
