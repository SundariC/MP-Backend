import express from "express";
import { createSessionNote } from "../Controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js"; // Inga unga auth middleware path check pannunga

const router = express.Router();

// Middleware 'protect' add panna thaan req.user kedaikum
router.post("/create", protect, createSessionNote); 

export default router;