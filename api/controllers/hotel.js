import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js"; 
// CREATE
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  try {
    const { city, ...others } = req.query;

    const query = {
      ...others,
    };

    if (city) {
      query.city = { $regex: city, $options: "i" }; // ✅ FIX
    }

    const hotels = await Hotel.find(query);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
// GET ONE
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities=req.query.cities.split(",")
  try {
    const list=await Promise.all(cities.map((city)=>{
       return Hotel.countDocuments({city:city})
    } )
  )
  res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    const rooms = await Promise.all(
  hotel.rooms.map((roomId) => Room.findById(roomId))
);

const list = rooms.filter((room) => room !== null);

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const getHotelStats = async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    // 1️⃣ Get hotel
    const hotel = await Hotel.findById(hotelId);

    // 2️⃣ Get all rooms of hotel
    const rooms = await Room.find({ _id: { $in: hotel.rooms } });

    const totalRooms = rooms.reduce(
      (sum, r) => sum + r.roomNumbers.length,
      0
    );

    // 3️⃣ Get bookings
    const bookings = await Booking.find({ hotelId });

    const bookedRoomIds = new Set();

      bookings.forEach((b) => {
        b.roomIds.forEach((id) => {
          bookedRoomIds.add(id.toString());
        });
      });

      const bookedRooms = bookedRoomIds.size;
    // 4️⃣ Calculate %
    const occupancy =
      totalRooms === 0 ? 0 : Math.round((bookedRooms / totalRooms) * 100);

    res.json({
      totalRooms,
      bookedRooms,
      occupancy,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};