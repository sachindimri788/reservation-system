const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "places",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transactions",
      required: true,
    },
    bookingFrom: {
      type: Date,
      required: true,
    },
    bookingTo: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accept", "decline"],
      default: "pending",
    },
    numberOfGuest: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
