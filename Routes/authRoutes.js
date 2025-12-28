import express from "express";
import {
  register,
  login,
  updateProfile,
  getAllCounselors,
  getMyProfile
} from "../Controllers/authController.js";
import { isCounselor, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMyProfile);      // ✅ Added
router.put("/update-profile", protect, isCounselor, updateProfile);
router.get("/counselors", getAllCounselors);

export default router;
