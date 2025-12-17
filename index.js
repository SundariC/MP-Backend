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

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
    origin: "*",
    methods: ["GET", "POST"]
   }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

io.on("connection", (socked) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_chat", (bookingId) => {
        socket.join(bookingId);
        console.log(`User joined room: ${bookingId}`);
    });
    socket.on("send_message", (data) => {
        io.to(data.bookingId).emit("receive message");
    });
    socket.on("disconnected", () => {
        console.log("User Disconnected");
    });
});

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log("Server started");
});

server.listen(PORT, () => {
    console.log("Chat Server started");
});