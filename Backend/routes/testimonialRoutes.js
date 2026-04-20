import express from "express";
const router = express.Router();

// Controllers
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js"; // 👈 .js መጨመሩን እርግጠኛ ሁን

// Middleware
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// የአድሚን ሮሎች ዝርዝር
const adminRoles = ["admin", "superadmin", "masjid_admin"];

/**
 * @route   /api/testimonials
 */
router
  .route("/")
  // 🌐 Public: Get all testimonials
  .get(getTestimonials)

  // 🔒 Protected: Create testimonial (ሁሉም የገቡ ተጠቃሚዎች ምስክርነት መስጠት እንዲችሉ)
  .post(
    protect,
    multerMiddleware.single("image"), 
    createTestimonial
  );

/**
 * @route   /api/testimonials/:id
 */
router
  .route("/:id")

  // 🌐 Public: Get single testimonial
  .get(getTestimonial)

  // 🔒 Admin only: Update testimonial
  .put(
    protect,
    allowRoles(...adminRoles), // 👈 ሁሉንም አድሚኖች እንዲፈቅድ
    multerMiddleware.single("image"),
    updateTestimonial
  )

  // 🔒 Admin only: Delete testimonial
  .delete(
    protect,
    allowRoles(...adminRoles),
    deleteTestimonial
  );

export default router;