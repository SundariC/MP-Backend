import jwt from "jsonwebtoken";
import User from "../Models/User.js";


// 1. General Protect: Logged in checking
export const protect = async (req, res, next) => {
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ")
  // ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      console.log("user found in protect middleware:", decoded);
      // req.user-la { id, role } 
      req.user = user; 
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  // } else {
  //   return res.status(401).json({ message: "No token, authorization denied" });
  // }
};

// 2. Counselor Only: Counselor features
export const isCounselor = (req, res, next) => {
  if (req.user && req.user.role === "counselor") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. This action is only for licensed counselors." 
    });
  }
};

// 3. Client Only: Booking client checking
export const isClient = (req, res, next) => {
  if (req.user && req.user.role === "client") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. Only clients can perform this action." 
    });
  }
};