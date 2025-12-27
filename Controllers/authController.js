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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Credentials" });

    // ✅ PASSWORD CHECK (MANDATORY)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
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

// Update Profile (Counselor)
export const updateProfile = async (req, res) => {
  try {
    const { specialization, bio, price, image, services, availability } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { specialization, bio, price, image, services, availability },
      { new: true }
    );

    res.json({ message: "Profile updated!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// ✅ Fix: sender ID-ah request user-la irunthu edukanum
export const sendMessage = async (req, res) => {
  try {
    const { bookingId, text } = req.body;
    const message = await Message.create({
      bookingId,
      sender: req.user.id, // Auth middleware-la irunthu varum
      text,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
