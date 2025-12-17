import Booking from "../Models/Booking.js";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_dummyID", 
    key_secret: "dummySecret",
})

//create Bookings
export const createBooking = async (req, res) => {
    try {
        const { counselorId, sessionType, appointmentDate } = req.body;
        const clientId = req.user.id;

        const newBooking = new Booking({
            client: clientId,
            counselor: counselorId,
            sessionType: sessionType.toLowerCase(),
            appointmentDate
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });  
    } catch (error) {
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

//Create Payment Order  
export const createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};