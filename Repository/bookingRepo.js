const bookingModel = require("../Model/bookingModel");

exports.bookPlace = async (bookInfo) => {
  return await bookingModel.create(bookInfo);
};

exports.isGuestVisitedToPlace = async (guestId, placeId) => {
  return await bookingModel.countDocuments({
    guestId,
    placeId,
    status: "accept",
    bookingTo: {
      $lte: new Date(),
    },
  });
};

exports.bookedPlacesIds = async (checkIn, checkOut) => {
  return await bookingModel.aggregate([
    {
      $match: {
        status: { $ne: "decline" },
        $or: [
          {
            bookingFrom: { $lt: checkOut },
            bookingTo: { $gt: checkIn },
          },
          {
            bookingFrom: { $lt: checkOut },
            bookingTo: { $gte: checkIn, $lte: checkOut },
          },
          {
            bookingFrom: { $gte: checkIn, $lte: checkOut },
            bookingTo: { $gt: checkOut },
          },
          {
            bookingFrom: { $gte: checkIn },
            bookingTo: { $lte: checkOut },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "places",
        localField: "placeId",
        foreignField: "_id",
        as: "placeInfo",
      },
    },
    {
      $addFields: {
        capacity: { $arrayElemAt: ["$placeInfo.capacity", 0] },
      },
    },
    {
      $group: {
        _id: "$placeId",
        totalGuests: { $sum: "$numberOfGuest" },
        capacity: { $first: "$capacity" },
      },
    },
  ]);
};

exports.getBookingInfoByPlaceId = async (placeId) => {
  return await bookingModel.find({ placeId });
};

exports.updateBookingStatus = async (bookingId, status) => {
  return await bookingModel.updateOne({ _id: bookingId }, { $set: { status } });
};

exports.getBookingInfoByBookingId = async (bookingId) => {
  return await bookingModel.findOne({ _id: bookingId });
};

exports.getBookingInfoByGuestId = async (guestId) => {
  return await bookingModel.find({ guestId });
};
