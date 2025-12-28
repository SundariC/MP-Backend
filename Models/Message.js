import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  // Booking ID reference-ah save aaganum
  bookingId: { 
    type: String, // String-ah vachikitta dynamic-ah irukum, or use mongoose.Schema.Types.ObjectId
    required: true,
    index: true 
  },
  sender: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;