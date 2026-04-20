import express from "express";
const router = express.Router();

// ✅ ማስተካከያ፡ በ import መጠቀም አለብህ
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import multerMiddleware from "../middleware/multerMiddleware.js";

// ✅ ማስተካከያ፡ በ import መጠቀም አለብህ
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  getAdmins,
  editAdmin,
  deleteAdmin,
  updateProfilePicture,
} from "../controllers/userController.js";

// --- Routes ---

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/update-details", protect, updateDetails);
router.put("/update-password", protect, updatePassword);

router.put(
  "/upload-picture",
  protect,
  multerMiddleware.single("profilePicture"),
  updateProfilePicture
);

router
  .route("/admins")
  // 💡 ማስተካከያ፡ እዚህ ጋር ሮሎቹን በትንሽ ፊደል (lowercase) አድርገናቸዋል
  .get(protect, allowRoles("superadmin", "admin", "masjid_admin"), getAdmins)
  .post(protect, allowRoles("superadmin"), register);

router
  .route("/admins/:id")
  .put(protect, allowRoles("superadmin"), editAdmin)
  .delete(protect, allowRoles("superadmin"), deleteAdmin);

export default router;
