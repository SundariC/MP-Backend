import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import connectDB from "./Database/dbConfig.js";
import messageRoutes from "./Routes/messageRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import sessionRoutes from "./Routes/sessionRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/session", sessionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
