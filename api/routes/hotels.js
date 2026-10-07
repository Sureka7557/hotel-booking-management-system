import express from "express";
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getHotels,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelStats
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createHotel);

// UPDATE
router.put("/:id",verifyAdmin,  updateHotel);

// DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

// GET ONE
router.get("/find/:id", getHotel);

// GET ALL
router.get("/", getHotels);
router.get("/all", getHotels);
// COUNT
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);

// GET ROOMS
router.get("/rooms/:id", getHotelRooms);
router.get("/hotelStats/:hotelId", getHotelStats);
export default router;