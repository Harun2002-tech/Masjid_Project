import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/payment.Controller.js";

const router = express.Router();

/**
 * 1. ክፍያ ለማስጀመር (Initialize Payment)
 */
router.post("/initialize", initializePayment);

/**
 * 2. የክፍያ ሁኔታን ለማረጋገጥ (Verify Payment)
 */
router.get("/verify/:tx_ref", verifyPayment);

export default router;
