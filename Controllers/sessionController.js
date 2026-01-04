import Session from "../Models/Session.js";
import Booking from "../Models/Booking.js";

export const createSessionNote = async (req, res) => {
  try {
    const { bookingId, sessionNotes } = req.body;
    const counselorId = req.user ? req.user.id : req.body.counselorId;

    const newSession = new Session({
      bookingId,
      counselorId,
      sessionNotes
    });

    await newSession.save();

    // Booking status update
    await Booking.findByIdAndUpdate(bookingId, { status: 'COMPLETED' });

    res.status(201).json({ message: "Success!" });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: error.message });
  }
};