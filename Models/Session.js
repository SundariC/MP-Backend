import mongoose from "mongoose";

const sessionNoteSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  attachments: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Session", sessionNoteSchema);
