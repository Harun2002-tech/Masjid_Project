import express from "express";
const router = express.Router();

import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.Controller.js"; // 👈 .js መጨመሩን አረጋግጥ

import { protect } from "../middleware/authMiddleware.js";

/**
 * 1. ክፍያ ለማስጀመር (Initialize Payment)
 * 🛡️ ተጠቃሚው መግባቱን ለማረጋገጥ protect ጨምረናል
 */
router.post("/initialize", protect, initializePayment);

/**
 * 2. የክፍያ ሁኔታን ለማረጋገጥ (Verify Payment)
 * ይህ በ Chapa ወይም በሌላ የክፍያ መንገድ በኩል የሚመጣውን tx_ref ያረጋግጣል
 */
router.get("/verify/:tx_ref", protect, verifyPayment);

export default router;
