import express from "express";
const router = express.Router();

import { getStats } from "../controllers/statsController.js"; // 👈 .js መጨመሩን እርግጠኛ ሁን

/**
 * @route   GET /api/stats
 * @desc    አጠቃላይ የሲስተሙን ስታቲስቲክስ ለማግኘት (ለሁሉም ክፍት)
 * @access  Public
 */
router.route("/").get(getStats);

export default router;
