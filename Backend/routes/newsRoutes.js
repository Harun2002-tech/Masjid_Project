import express from "express";
const router = express.Router();

import {
  getAllNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js"; // 👈 .js መጨመር እንዳትረሳ

// ሚድልዌሮችን ማምጣት
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import processUploads from "../middleware/processUploads.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/**
 * 1. ዜናዎችን ለማየት እና አዲስ ለመፍጠር
 */
router
  .route("/")
  .get(getAllNews) // ዜና ማየት ለሁሉም ክፍት ነው
  .post(protect, allowRoles(...adminRoles), upload.single("image"), processUploads, createNews);

/**
 * 2. አንድን ዜና ለይቶ ለማግኘት፣ ለማስተካከል እና ለመሰረዝ
 */
router
  .route("/:id")
  .get(getNewsById)
  .put(
    protect,
    allowRoles(...adminRoles),
    upload.single("image"),
    processUploads,
    updateNews
  )
  .delete(protect, allowRoles(...adminRoles), deleteNews);

export default router;
