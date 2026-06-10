import express from "express";
const router = express.Router();

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect, allowRoles } from "../middleware/authMiddleware.js";

const adminRoles = ["admin", "superadmin", "masjid_admin"];

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", protect, allowRoles(...adminRoles), createEvent);
router.put("/:id", protect, allowRoles(...adminRoles), updateEvent);
router.delete("/:id", protect, allowRoles(...adminRoles), deleteEvent);

export default router;
