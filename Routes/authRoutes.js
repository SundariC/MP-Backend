import express from "express";
import { register, login, updateProfile, getAllCounselors } from "../Controllers/authController.js";
import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.put("/update", protect, updateProfile);
router.get("/counselors", getAllCounselors)

export default router;