import Booking from "../Models/Booking.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//create Bookings
// export const createBooking = async (req, res) => {
//     try {
//         const { counselorId, sessionType, appointmentDate } = req.body;
//         const clientId = req.user.id;

//         const newBooking = new Booking({
//             client: clientId,
//             counselor: counselorId,
//             sessionType: sessionType.toLowerCase(),
//             appointmentDate
//         });

//         await newBooking.save();
//         res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });  
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
export const createBooking = async (req, res) => {
    try {
        const { counselorId, appointmentDate, timeSlot, paymentId } = req.body;
        const clientId = req.user.id;

        const newBooking = new Booking({
            client: clientId,
            counselor: counselorId,
            appointmentDate,
            timeSlot, // Time slot add pannunga
            paymentId,
            status: "confirmed", // Payment mudinjadhala direct-ah confirm pannalam
            sessionType: "video"
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking Confirmed!", booking: newBooking });  
    } catch (error) {
        console.log("DB Save Error:", error);
        res.status(500).json({ message: error.message });
    }
};

//Get Bookings for logged-in User
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        if (userRole === "counselor" ) {
            query = { counselor: userId };
        } else {
            query = { client: userId }
        }
        const bookings = await Booking.find(query)
        .populate("client", "name email")
        .populate("counselor", "name specialization");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

//Update bookings from counselor
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const meetingLink = `https://meet.jit.si/counseling-${bookingId}`;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status, videoLink: meetingLink },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.json({ message: `Booking status updated to ${status}`, booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Payment Order  
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body; 
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    const options = {
      amount: Number(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    console.log("Creating Razorpay Order for:", amount); 
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.log("Razorpay Error Details:", err);
    res.status(500).json({ message: "Payment order failed", error: err.message });
  }
};
