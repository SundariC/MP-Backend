import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import connectDB from "./Database/dbConfig.js";
import bookingRoutes from "./Routes/bookingRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log("Server started");
});