import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true] 
  },
  email: { 
    type: String, 
    required: [true], 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true],
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ["client", "counselor"], 
    default: "client" 
  }, 
  specialization: { type: String }, 
  bio: { type: String },
  price: { type: Number },
  rating: { type: Number, default: 0 },
  image: { type: String },

  // ✅ ADDED (TASK REQUIREMENT)
  availability: [
    {
      day: { type: String },
      slots: [{ type: String }]
    }
  ],

  services: [
    {
      type: String,
      enum: ["mental", "career", "relationship"]
    }
  ]

}, { timestamps: true }); 

const User = mongoose.model("User", userSchema);
export default User;
