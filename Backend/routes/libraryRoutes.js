import express from "express";
const router = express.Router();

import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/libraryController.js"; // 👈 .js መጨመር እንዳትረሳ

// ወጥ የሆነ የሚድልዌር አጠራር ለመጠቀም
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */

/**
 * 1. መጻሕፍትን ለማየት (ለሁሉም ክፍት)
 */
router.get("/", getBooks);
router.get("/:id", getBookById);

/* ================= ADMIN ONLY ROUTES ================= */

/**
 * 2. አዲስ መጽሐፍ ለመጨመር
 */
router.post(
  "/",
  protect,
  allowRoles(...adminRoles), // 👈 ሁሉንም አድሚኖች እንዲፈቅድ
  multerMiddleware.single("file"),
  addBook
);

/**
 * 3. መጽሐፍ ለማስተካከል
 */
router.put(
  "/:id",
  protect,
  allowRoles(...adminRoles),
  multerMiddleware.single("file"),
  updateBook
);

/**
 * 4. መጽሐፍ ለመሰረዝ
 */
router.delete("/:id", protect, allowRoles(...adminRoles), deleteBook);

export default router;
