const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    postalCode: {
      type: Number,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    dailyDiscount: {
      type: Number,
      require: true,
    },
    amenities: {
      type: Array,
      of: String,
    },
    weeklyDiscount: {
      type: Number,
      require: true,
    },
    cleaningFee: {
      type: Number,
      require: true,
    },
    serviceFee: {
      type: Number,
      require: true,
    },
    capacity: {
      type: Number,
      require: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("places", placeSchema);

module.exports = Place;
