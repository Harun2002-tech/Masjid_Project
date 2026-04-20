import express from "express";
const router = express.Router();

import {
  addMasjid,
  getAllMasjid,
  getPrayerTimesById,
  updateMasjid,
  deleteMasjid,
} from "../controllers/prayerController.js"; // 👈 .js መጨመር እንዳትረሳ

// ሚድልዌሮችን ማምጣት
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር (ለተለዋዋጭነት ሲባል)
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/* ================= PUBLIC ROUTES ================= */

// 1. ሁሉንም መስጂዶች ለማየት
router.get("/", getAllMasjid);

// 2. የሰላት ሰዓቶችን ለማየት
router.get("/:id/prayers", getPrayerTimesById);

/* ================= ADMIN ONLY ROUTES ================= */

/**
 * 3. አዲስ መስጂድ ለመመዝገብ
 */
router.post(
  "/",
  protect,
  allowRoles(...adminRoles), // 👈 ሁሉንም አይነት አድሚኖች ይፈቅዳል
  multerMiddleware.single("image"), 
  addMasjid
);

/**
 * 4. የመስጂድ መረጃ ለማሻሻል እና ለመሰረዝ
 */
router
  .route("/:id")
  .patch(
    protect,
    allowRoles(...adminRoles),
    multerMiddleware.single("image"),
    updateMasjid
  )
  .put(
    protect,
    allowRoles(...adminRoles),
    multerMiddleware.single("image"),
    updateMasjid
  )
  .delete(protect, allowRoles(...adminRoles), deleteMasjid);

export default router;