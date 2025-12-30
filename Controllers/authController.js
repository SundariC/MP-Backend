import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Register User
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, specialization, price, services, availability } = req.body;

    // Validation: Check mandatory fields
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

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
    res.status(201).json({ message: "User registered Successfully", user: { fullName, email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Field validation check
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // JWT Generation
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Sending back unified data structure
    res.status(200).json({
      message: "User Logged In Successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { specialization, bio, price, experience, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { specialization, bio, price, experience, location },
      { new: true } 
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 4. Get all counselors
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" }).select("-password");
    res.status(200).json(counselors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};