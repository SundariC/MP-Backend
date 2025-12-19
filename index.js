import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./Routes/authRoutes.js";
import connectDB from "./Database/dbConfig.js";
import bookingRoutes from "./Routes/bookingRoutes.js"

dotenv.config();
connectDB();

const app = express(); 

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
   }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_chat", (bookingId) => {
        socket.join(bookingId);
        console.log(`User joined room: ${bookingId}`);
    });
    socket.on("send_message", (data) => {
        io.to(data.bookingId).emit("receive message", data);
    });
    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
    console.log("Server & Chat Server started");
});