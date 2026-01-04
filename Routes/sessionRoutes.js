import express from "express";
import { createSessionNote } from "../Controllers/sessionController.js";
import { protect } from "../Middleware/authMiddleware.js"; 

const router = express.Router();
router.post("/create", protect, createSessionNote); 

export default router;