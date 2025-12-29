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

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ ROLE-ah inga kandaipa anupanum
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role // This was missing
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile (Counselor)
export const updateProfile = async (req, res) => {
  try {
    // req.user.id eppo kidaikum-na neenga "Protect" middleware use pannum pothu
    const userId = req.user.id; 
    const { specialization, bio, price, experience, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { specialization, bio, price, experience, location },
      { new: true } // Updated data-ah return panna
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

// // ✅ Fix: sender ID-ah request user-la irunthu edukanum
// export const sendMessage = async (req, res) => {
//   try {
//     const { bookingId, text } = req.body;
//     const message = await Message.create({
//       bookingId,
//       sender: req.user.id, // Auth middleware-la irunthu varum
//       text,
//     });
//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Forgot Password - Step 1: Request Reset (Simulated)
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // In a real app, you'd send an email with a token here.
//     // For now, we return success so the UI can proceed.
//     res.json({ message: "Reset link sent to your email" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Reset Password - Step 2: Update Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body; // or use a token from params
    
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     const user = await User.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };