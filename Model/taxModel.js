const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Tax = mongoose.model("taxes", taxSchema);

module.exports = Tax;
