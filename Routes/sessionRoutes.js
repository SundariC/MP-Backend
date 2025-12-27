import express from "express";
import { getSessionNotes, addSessionNote } from "../Controllers/sessionController.js";
import { protect, isCounselor } from "../Middleware/authMiddleware.js"; // Corrected Import

const router = express.Router();

router.post("/add-note", protect, isCounselor, addSessionNote); 
router.get("/:bookingId", protect, getSessionNotes);

export default router;