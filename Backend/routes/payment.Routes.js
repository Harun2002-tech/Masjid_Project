import express from "express";
const router = express.Router();

import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.Controller.js";

/**
 * 1. ክፍያ ለማስጀመር (Initialize Payment)
 * 🔓 ማንኛውም ሰው (ሳይመዘገብ/ሳይገባ) መክፈል እንዲችል protect ተነስቷል
 */
router.post("/initialize", initializePayment);

/**
 * 2. የክፍያ ሁኔታን ለማረጋገጥ (Verify Payment)
 * 🔓 Chapa ክፍያው ከተጠናቀቀ በኋላ redirect ስለሚያደርግ protect አያስፈልገውም
 */
router.get("/verify/:tx_ref", verifyPayment);

export default router;
