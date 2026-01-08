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

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? "*" : "https://mp-frontend-lemon.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/session", sessionRoutes);

app.get("/", (req, res) => {
  res.send("Server is running perfectly!");
});

// Socket setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "development" ? "*" : "https://mp-frontend-lemon.vercel.app",
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);
  socket.on("join_room", (id) => {
    socket.join(id);
    console.log(`Joined room: ${id}`);
  });
});

// Database Connection & Server Start
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is LIVE on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();