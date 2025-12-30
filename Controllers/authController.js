import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      specialization,
      price,
      services,
      availability
    } = req.body;

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      specialization,
      price,
      services,
      availability
    });

    await user.save();
    res.status(201).json({ message: "User registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
// Backend-la ippadi irukka nu check pannunga
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Field missing-ah irundha 400 error varum
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // User check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Password check (Bcrypt check)
    // ...
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
     
    const userId = req.user.id; 
    const { specialization, bio, price, experience, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { specialization, bio, price, experience, location },
      { new: true } 
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all counselors
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" }).select("-password");
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

