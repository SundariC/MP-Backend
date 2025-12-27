import Session from "../Models/Session.js";

// Add session note (Counselor only)
export const addSessionNote = async (req, res) => {
  try {
    const { bookingId, note } = req.body; 

    if (!bookingId || !note) {
      return res.status(400).json({ message: "Booking ID and note are required" });
    }

    const newNote = await Session.create({
      bookingId, 
      note,
      // ✅ FIX: 'counselorId' ku bathula 'counselor' nu mathirukom
      // Model-la entha name iruko athe thaan ingaiyum irukanum
      counselor: req.user.id, 
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notes for a booking
export const getSessionNotes = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // ✅ populate("counselor") nu mathunga (Model-la irukira field name)
    const notes = await Session.find({ bookingId })
      .populate("counselor", "fullName");

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};