import express from "express";
import {
  register,
  login,
  updateProfile,
  getAllCounselors,
  getMyProfile,
  // resetPassword,
  // forgotPassword
} from "../Controllers/authController.js";
import { isCounselor, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMyProfile);     
router.put("/update-profile", protect, isCounselor, updateProfile);
router.get("/counselors", getAllCounselors);
// router.post("/reset-password", resetPassword);
// router.post("/forgot-password", forgotPassword);

export default router;
