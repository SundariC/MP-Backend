import express from "express";
import { sendMessage, getMessages } from "../Controllers/messageController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Send message
router.post("/", protect, sendMessage);

// Get chat messages by bookingId
router.get("/:bookingId", protect, getMessages);

export default router;
