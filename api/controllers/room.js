import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;

  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};


export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};



export const deleteRoom = async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};


export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

// ✅ CORRECT
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
export const getRoomsByHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );

    res.status(200).json("Room availability updated");
  } catch (err) {
    next(err);
  }
};

export const getRoomStats = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json("Invalid Room ID");
    }

    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    // GET ROOM
    const room = await Room.findById(roomObjectId);
    if (!room) return res.status(404).json("Room not found");

    const totalRooms = room.roomNumbers?.length || 0;

    // ✅ FIX: Collect all roomNumber subdocument _ids from this room
    const roomNumberIds = room.roomNumbers.map((r) => r._id);

    // ✅ FIX: Search bookings by roomNumber subdoc _ids, not room doc _id
    const bookingsData = await Booking.find({
      roomIds: { $in: roomNumberIds },
    });

    const bookings = bookingsData.length;

    // ✅ Count how many individual roomNumber slots were booked across all bookings
    let bookedSlots = 0;
    for (let booking of bookingsData) {
      const overlap = booking.roomIds.filter((rid) =>
        roomNumberIds.some((rn) => rn.toString() === rid.toString())
      );
      bookedSlots += overlap.length;
    }

    const profit = bookedSlots * room.price;
    const loss = Math.max(0, totalRooms - bookedSlots) * room.price;

    res.status(200).json({
      bookings,      // number of booking documents
      bookedSlots,   // total individual room slots booked
      totalRooms,
      profit,
      loss,
    });

  } catch (err) {
    console.error("ROOM STATS ERROR:", err);
    res.status(500).json(err.message);
  }
};