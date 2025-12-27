import Message from "../Models/Message.js";

// Send Message (Client / Counselor)
export const sendMessage = async (req, res) => {
  try {
    const { bookingId, text } = req.body;

    if (!bookingId || !text) {
      return res.status(400).json({ message: "BookingId and message required" });
    }

    const message = await Message.create({
      bookingId,
      text,
      sender: req.user.id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Messages for a Booking (Chat History)
export const getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const messages = await Message.find({ bookingId }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
