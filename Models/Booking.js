import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING"
  },

  sessionStatus: {
    type: String,
    enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
    default: "UPCOMING"
  },

  videoLink: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
