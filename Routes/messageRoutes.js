import express from "express";
import { sendMessage, getMessagesByBooking } from "../Controllers/messageController.js";
// import { protect } from "../Middleware/authMiddleware.js"; 

const router = express.Router();

// Route: POST /api/messages/send
router.post("/send", sendMessage);

// Route: GET /api/messages/:bookingId
router.get("/:bookingId", getMessagesByBooking);

export default router;