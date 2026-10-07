import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";
import { hotels } from "./data.js";

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");

    // 1. Create room types
    const createdRooms = await Room.insertMany([
      {
        title: "Single Room",
        price: 1000,
        maxPeople: 1,
        desc: "Single bed room",
        roomNumbers: [{ number: 101 }, { number: 102 }],
      },
      {
        title: "Double Room",
        price: 2000,
        maxPeople: 2,
        desc: "Double bed room",
        roomNumbers: [{ number: 201 }, { number: 202 }],
      },
      {
        title: "Deluxe Room",
        price: 3000,
        maxPeople: 3,
        desc: "Deluxe luxury room",
        roomNumbers: [{ number: 301 }, { number: 302 }],
      },
      {
        title: "Suite",
        price: 5000,
        maxPeople: 4,
        desc: "Premium suite",
        roomNumbers: [{ number: 401 }, { number: 402 }],
      },
    ]);

    // Extract IDs
    const roomIds = createdRooms.map((room) => room._id);

    // Attach rooms to each hotel
const hotelsWithRooms = hotels.map((hotel) => ({
  ...hotel,
  rooms: roomIds, // ✅ inject room IDs
}));

await Hotel.insertMany(hotelsWithRooms);
    console.log("Hotels + Rooms seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();