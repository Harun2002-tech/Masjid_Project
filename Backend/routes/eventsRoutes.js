import express from "express";
const router = express.Router();

import {
  createEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js"; // 👈 .js መጨመሩን እርግጠኛ ሁን

// ሚድልዌሮችን ማምጣት
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

// 1. ዝግጅቶችን ለማየት እና ለመፍጠር
router
  .route("/")
  .get(getAllEvents) // ሁሉም ሰው ዝግጅቶችን ማየት ይችላል
  .post(
    protect,
    allowRoles(...adminRoles), // 👈 ሁሉንም አድሚኖች እንዲፈቅድ
    multerMiddleware.single("image"), // የዝግጅቱን ምስል ለመቀበል
    createEvent
  );

// 2. አንድን ዝግጅት ለይቶ ለማግኘት፣ ለማስተካከል እና ለመሰረዝ
router
  .route("/:id")
  .get(getEventById)
  .put(
    protect,
    allowRoles(...adminRoles),
    multerMiddleware.single("image"), // ምስሉን ለማስተካከል
    updateEvent
  )
  .delete(protect, allowRoles(...adminRoles), deleteEvent);

// 3. ለዝግጅት ለመመዝገብ (የገባ ተጠቃሚ ብቻ)
router.post("/:id/register", protect, registerForEvent);

export default router;
