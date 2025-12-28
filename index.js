import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; // ADDED
import { Server } from "socket.io"; // ADDED
import authRoutes from "./Routes/authRoutes.js";
import connectDB from "./Database/dbConfig.js";
import messageRoutes from "./Routes/messageRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import sessionRoutes from "./Routes/sessionRoutes.js";

dotenv.config();
connectDB();

const app = express();

// 1. Setup CORS
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// 2. Create HTTP Server for Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 3. Socket Logic
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined room: ${bookingId}`);
  });

  socket.on("send_message", (data) => {
    // 📢 ITHU THAAN MUKKIYAM: room-la irukura ellarukum anupum (sender-ah thavira)
    // 'socket.to' use pannuna sender-ku message thirumba varathu, 
    // so namma frontend-laye local state update panrom.
    socket.to(data.bookingId).emit("receive_message", data);
  });
});

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/session", sessionRoutes);

app.get("/", (req, res) => {
  res.send("Server is running with Socket.io");
});

// 5. Start Server (Note: httpServer use pannanum, app illa)
const PORT = process.env.PORT || 3000; // Dashboard-padi 3000 vachikalam
httpServer.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});