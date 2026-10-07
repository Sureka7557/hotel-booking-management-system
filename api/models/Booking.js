import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    roomIds: [
      {
        type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      },
    ],
    dates: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);