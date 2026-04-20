import express from "express";
const router = express.Router();

import { sendContactEmail } from "../controllers/contactController.js"; // 👈 .js መጨመር እንዳትረሳ

/**
 * @route   POST /api/contact
 * @desc    የእውቂያ መልዕክት መላኪያ (Contact Us)
 * @access  Public (ለሁሉም ክፍት)
 */
router.post("/", sendContactEmail);

export default router;
