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
    sessionType: { 
        type: String, 
        required: true 
    },
    appointmentDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        default: "pending" 
    },
    isPaid: { 
        type: Boolean, 
        default: false 
    },
    videoLink: {
        type: "String",
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);