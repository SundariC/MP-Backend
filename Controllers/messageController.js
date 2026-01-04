import Message from "../Models/Message.js";

//1. Message save 
export const sendMessage = async (req, res) => {
  try {
    console.log("Data received in backend:", req.body); 

    const { bookingId, sender, text, role } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is empty" });
    }

    const newMessage = new Message({ 
      bookingId, 
      sender, 
      text, 
      role 
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Chat History
export const getMessagesByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    
    const messages = await Message.find({ bookingId })
      .sort({ createdAt: 1 }); 

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages Controller:", error);
    res.status(500).json({ message: "Server error while fetching history" });
  }
};