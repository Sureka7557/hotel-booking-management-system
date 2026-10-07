import User from "../models/User.js";
import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createUser = async (req, res, next) => {
  try {
    console.log("BODY:", req.body); // debug

    if (!req.body.password) {
      return next(createError(400, "Password is required"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err); // 👈 IMPORTANT
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // ✅ hash password only if exists
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("UPDATE USER ERROR:", err); // 👈 ADD THIS
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};


export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({isAdmin:false});
    res.status(200).json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err); // 🔥 ADD THIS
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const { password, ...otherDetails } = user._doc;

    res.status(200).json(otherDetails);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getUserStats = async (req, res) => {
  const userId = req.params.userId;

  try {
    // USER BOOKINGS
    const bookings = await Booking.find({ userId });

        let totalRoomsBooked = 0;

    bookings.forEach((booking) => {
      totalRoomsBooked += booking.roomIds.length;
    });
    res.status(200).json({
      totalBookings: bookings.length,

      totalRoomsBooked,

      lastBooking:
        bookings.length > 0
          ? bookings[bookings.length - 1].createdAt
          : null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};