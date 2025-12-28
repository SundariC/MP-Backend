import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  counselorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  sessionNotes: { 
    type: String, 
    default: "" 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ✅ INTHA RENDU LINE-AH CORRECT-AH PAARUNGA
const Session = mongoose.model("Session", sessionSchema);
export default Session;