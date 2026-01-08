import Booking from "../Models/Booking.js";

export const createSessionNote = async (req, res) => {
  try {
    const { bookingId, sessionNotes } = req.body;

    // Booking status update
    await Booking.findByIdAndUpdate(bookingId, { status: 'COMPLETED', sessionNotes });

    res.status(201).json({ message: "Success!" });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: error.message });
  }
};