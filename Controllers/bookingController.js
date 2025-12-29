import Booking from "../Models/Booking.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE BOOKING (AFTER PAYMENT)
export const createBooking = async (req, res) => {
  try {
    const {
      counselor,          // ✅ frontend match
      appointmentDate,
      timeSlot,
      amount,
      sessionType
    } = req.body;

    if (!counselor || !appointmentDate || !timeSlot || !amount) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    const booking = await Booking.create({
      client: req.user.id,
      counselor,
      appointmentDate,
      timeSlot,
      amount,
      sessionType, 
      paymentStatus: "PAID",
      sessionStatus: "UPCOMING"
    });

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BOOKINGS (CLIENT / COUNSELOR)
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const query =
      role === "counselor"
        ? { counselor: userId }
        : { client: userId };

    const bookings = await Booking.find(query)
      .populate("client", "fullName email")
      .populate("counselor", "fullName specialization");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateBookingStatus-la rejectionReason sethukonga
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, sessionStatus, rejectionReason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        sessionStatus, 
        rejectionReason: sessionStatus === 'CANCELLED' ? rejectionReason : "",
        videoLink: sessionStatus === 'UPCOMING' ? `https://meet.jit.si/session-${bookingId}` : ""
      },
      { new: true }
    );

    res.json({ message: "Status updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE RAZORPAY ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount)
      return res.status(400).json({ message: "Amount required" });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      order
    });
  } catch (err) {
    res.status(500).json({
      message: "Payment order failed",
      error: err.message
    });
  }
};

export const endSession = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.sessionStatus = "COMPLETED";
    booking.videoLink = null; // optional
    booking.endedAt = new Date();

    await booking.save();

    res.json({ message: "Session ended", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

