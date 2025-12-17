import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booking" 
},
  text: { 
    type: String, 
    required: true 
},
  timestamp: { 
    type: Date, 
    default: Date.now 
 },
});

export default mongoose.model("Message", messageSchema);
