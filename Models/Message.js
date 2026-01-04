import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  bookingId: { 
    type: String, 
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