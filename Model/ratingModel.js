const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
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
    ratingMessage: {
      type: String,
    },
    cleanliness: {
      type: Number,
      required: true,
    },
    detailMentioned: {
      type: Number,
      required: true,
    },
    communication: {
      type: Number,
      required: true,
    },
    location: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Number,
      required: true,
    },
    valueForMoney: {
      type: Number,
      required: true,
    },
    overallRating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Rating = mongoose.model("ratings", ratingSchema);

module.exports = Rating;
