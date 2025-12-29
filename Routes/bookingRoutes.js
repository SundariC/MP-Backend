import express from "express";
import { createBooking, createPaymentOrder, getMyBookings, updateBookingStatus, endSession } from "../Controllers/bookingController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.put("/end-session/:id", protect, endSession);
router.put("/update-status", protect, updateBookingStatus);
router.post("/create-order", protect, createPaymentOrder)

export default router;
