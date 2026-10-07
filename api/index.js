import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import cors from "cors";
import bookingRoute from "./routes/Booking.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB ");
  } catch (error) {
    throw error;
  }
};


mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected ");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ");

});
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRoute)
app.use('/api/hotels',hotelsRoute)
app.use('/api/rooms',roomsRoute)
app.use('/api/users',usersRoute)
app.use("/api/bookings", bookingRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend ");
});