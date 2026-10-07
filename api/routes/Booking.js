import express from "express";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { userId, hotelId, roomIds, dates } = req.body;

    if (!userId || !hotelId || !roomIds || !dates || roomIds.length === 0) {
      return res.status(400).json("Missing required fields");
    }

    // In your POST route, replace the normalize line with:
const normalizedDates = dates.map((d) => {
  const date = new Date(Number(d));
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
});

    const existingUserBookings = await Booking.find({
      userId,
      hotelId,
      roomIds: { $in: roomIds }, // any overlap in room selection
    });

    for (let existing of existingUserBookings) {
      const existingDates = existing.dates.map((d) => parseInt(d));
      const dateOverlap = normalizedDates.some((d) =>
        existingDates.includes(d)
      );
      if (dateOverlap) {
        return res.status(409).json({
          message:
            "You already have a booking for one of these rooms on the selected dates ❌",
        });
      }
    }

 
    for (let roomId of roomIds) {
      const room = await Room.findOne({ "roomNumbers._id": roomId });

      if (!room) {
        return res.status(404).json({ message: `Room not found: ${roomId}` });
      }

      const roomNumber = room.roomNumbers.find(
        (r) => r._id.toString() === roomId.toString()
      );

      if (!roomNumber) {
        return res.status(404).json({ message: "Room number not found" });
      }

      // ✅ Normalize stored dates too — this was the silent bug
      const storedDates = (roomNumber.unavailableDates || []).map((d) =>
        parseInt(new Date(d).getTime())  // handles both Number and Date stored formats
      );

      const conflict = normalizedDates.some((incoming) =>
        storedDates.includes(incoming)
      );

      if (conflict) {
        return res.status(409).json({
          message: `Room ${roomNumber.number} is already booked for the selected dates ❌`,
        });
      }
    }

    // ================================================
    // ✅ STEP 3: Lock availability BEFORE saving booking
    //    Use matchedCount to catch race conditions
    // ================================================
    for (let roomId of roomIds) {
      const result = await Room.updateOne(
        {
          "roomNumbers._id": roomId,
          // ✅ Atomic guard: only update if no conflict dates exist yet
          "roomNumbers": {
            $not: {
              $elemMatch: {
                _id: { $eq: roomId },
                unavailableDates: { $in: normalizedDates },
              },
            },
          },
        },
        {
          $push: {
            "roomNumbers.$.unavailableDates": { $each: normalizedDates },
          },
        }
      );

      // If matchedCount is 0, someone else booked it between our check and update
      if (result.matchedCount === 0) {
        // ✅ ROLLBACK: undo any rooms we already updated
        const alreadyUpdated = roomIds.slice(0, roomIds.indexOf(roomId));
        await Promise.all(
          alreadyUpdated.map((rid) =>
            Room.updateOne(
              { "roomNumbers._id": rid },
              {
                $pull: {
                  "roomNumbers.$.unavailableDates": { $in: normalizedDates },
                },
              }
            )
          )
        );

        return res.status(409).json({
          message:
            "A room was just booked by someone else. Please try again ❌",
        });
      }
    }

   
    const newBooking = new Booking({
      userId,
      hotelId,
      roomIds,
      dates: normalizedDates,
    });

    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json("Booking failed ❌");
  }
});

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
 router.get("/monthlyStats", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = months.map((month) => ({
      name: month,
      Total: 0,
    }));

    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);

      const monthIndex = date.getMonth();

      monthlyData[monthIndex].Total += 1;
    });

    res.status(200).json(monthlyData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    const result = [];

    for (let booking of bookings) {
      let rooms = [];

      for (let roomId of booking.roomIds) {
        const room = await Room.findOne({ "roomNumbers._id": roomId });
        if (!room) continue;

        const foundRoom = room.roomNumbers.find(
          (r) => r._id.toString() === roomId.toString()
        );
        if (foundRoom) rooms.push(foundRoom.number);
      }

      result.push({ ...booking._doc, roomNumbers: rooms });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

/* =========================
   DELETE / CANCEL BOOKING
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json("Booking not found ❌");

    const normalizedDates = booking.dates.map((d) => {
  const date = new Date(Number(d));
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
});
    // ✅ Free up the dates for those rooms
    await Promise.all(
      booking.roomIds.map((roomId) =>
        Room.updateOne(
          { "roomNumbers._id": roomId },
          {
            $pull: {
              "roomNumbers.$.unavailableDates": { $in: normalizedDates },
            },
          }
        )
      )
    );

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json("Booking cancelled successfully ✅");
  } catch (err) {
    console.error(err);
    res.status(500).json("Delete failed ❌");
  }
});

export default router;