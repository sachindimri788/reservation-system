const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("usersInformations", userInfoSchema);
module.exports = UserInfo;
