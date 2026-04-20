import express from "express";
const router = express.Router();

import {
  getDailyMessage,
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.js"; // 👈 .js መጨመር እንዳትረሳ

// ወጥ የሆነ የሚድልዌር አጠራር ለመጠቀም
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */

/**
 * 1. የዕለቱን መልዕክት በዘፈቀደ ለማግኘት (ለሁሉም ክፍት)
 */
router.get("/random", getDailyMessage);

/* ================= ADMIN ONLY ROUTES ================= */

/**
 * 2. መልዕክቶችን ለማስተዳደር
 */
router
  .route("/")
  .get(protect, allowRoles(...adminRoles), getAllMessages)
  .post(
    protect,
    allowRoles(...adminRoles),
    multerMiddleware.single("image"), // መልዕክቱ ምስል ካለው ለመቀበል
    createMessage
  );

router
  .route("/:id")
  .get(protect, allowRoles(...adminRoles), getMessageById)
  .put(
    protect,
    allowRoles(...adminRoles),
    multerMiddleware.single("image"), // ምስሉን ለማሻሻል
    updateMessage
  )
  .delete(protect, allowRoles(...adminRoles), deleteMessage);

export default router;
