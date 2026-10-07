import express from "express";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  getRoom,
  updateRoomAvailability,
  getRoomsByHotel,
  getRoomStats
} from "../controllers/room.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
// CREATE
router.post("/:hotelid", verifyAdmin, createRoom);
router.get("/roomStats/:roomId", getRoomStats);
// UPDATE
router.put("/:id", verifyAdmin, updateRoom);

// DELETE
router.delete("/:id", verifyAdmin, deleteRoom);

// ✅ GET ALL ROOMS
router.get("/", getRooms);

// ✅ GET ROOMS OF A HOTEL (more specific)
router.get("/hotel/:id", getRoomsByHotel);

// ✅ GET SINGLE ROOM (keep LAST)
router.get("/:id", getRoom);

// UPDATE AVAILABILITY
router.put("/availability/:id", updateRoomAvailability);

export default router;