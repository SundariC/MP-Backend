import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) 
        return res.status(400).json({ message: "User already exists " });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res
    .status(201)
    .json({ message: "User registered Successfully" });
  } catch (error) {
    res
    .status(500)
    .json({ message: error.message });
  }
};

//login USer
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res
    .status(500)
    .json({ message: error.message });
  }
};

//Update Profile (Mainly for Counselors)
export const updateProfile = async (req, res) => {
    try {
        const { specialization, bio, price, image } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { specialization, bio, price, image },
            { new: true }
        );

        res.json({ message: "Profile updated!", updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

//Get all counselors list for clients
export const getAllCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: "counselor" }).select("-password");
        res.json(counselors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
