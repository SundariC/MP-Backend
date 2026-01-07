import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; 
import { Server } from "socket.io"; 
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
  origin:  "https://mp-frontend-lemon.vercel.app" ,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://mp-frontend-lemon.vercel.app",
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling']
});


// const allowedOrigins = [
//   "https://mp-frontend-lemon.vercel.app", // Exact link from your error
//   "http://localhost:5173",
//   "http://localhost:3000"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));


// app.options("*", cors()); 

// app.use(express.json());

// 3. Socket Logic
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined room: ${bookingId}`);
  });

  socket.on("send_message", (data) => {
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

// 5. Start Server
const PORT = process.env.PORT || 3000; 
httpServer.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});