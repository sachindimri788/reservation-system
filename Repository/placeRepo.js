const placeModel = require("../Model/placeModel");

exports.countNumberOfPlacesAssociated = async (userId) => {
  return await placeModel.countDocuments({ hostId: userId });
};

exports.addPlace = async (placeInfo) => {
  return await placeModel.create(placeInfo);
};

exports.isTitleExists = async (title) => {
  return await placeModel.countDocuments({ title });
};

exports.isTitleExistsExceptTheCurrentPlace = async (title, placeId) => {
  return await placeModel.countDocuments({ title, _id: { $ne: placeId } });
};

exports.getAllHostPlaces = async (userId, pageNumber = 1, limit = 10) => {
  return await placeModel
    .find({ hostId: userId })
    .skip((pageNumber - 1) * limit)
    .limit(limit);
};

exports.isPlaceExists = async (placeId) => {
  return await placeModel.countDocuments({ _id: placeId });
};

exports.deleteHostPlace = async (placeId) => {
  return await placeModel.deleteOne({ _id: placeId });
};

exports.countTotalNumberHostPlaces = async (userId) => {
  return await placeModel.countDocuments({ hostId: userId });
};

exports.updateHostPlace = async (placeId, placeInfo) => {
  return await placeModel.updateOne({ _id: placeId }, { $set: placeInfo });
};

exports.searchAvailablePlaces = async (
  pageNumber = 1,
  limit = 10,
  fullyBookedPlaceIds,
  location,
  numberOfGuest
) => {
  return await placeModel.aggregate([
    {
      $match: {
        _id: {
          $nin: fullyBookedPlaceIds,
        },
        $or: [
          { city: { $regex: location, $options: "i" } },
          { location: { $regex: location, $options: "i" } },
          { country: { $regex: location, $options: "i" } },
        ],
        capacity: { $gte: numberOfGuest },
      },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "placeId",
        as: "ratings",
      },
    },
    {
      $addFields: {
        overallRating: { $avg: "$ratings.overallRating" },
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "placeId",
        as: "images",
      },
    },
    {
      $addFields: {
        images: {
          $map: {
            input: "$images",
            as: "image",
            in: {
              _id: "$$image._id",
              image: "$$image.image",
            },
          },
        },
      },
    },
    {
      $skip: (pageNumber - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);
};

exports.getPlaceById = async (placeId) => {
  return await placeModel.findOne({ _id: placeId });
};

exports.recommendedPlaces = async (location) => {
  return await placeModel.aggregate([
    {
      $match: {
        $or: [
          { city: { $regex: location, $options: "i" } },
          { location: { $regex: location, $options: "i" } },
          { country: { $regex: location, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "placeId",
        as: "ratings",
      },
    },
    {
      $addFields: {
        overallRating: { $avg: "$ratings.overallRating" },
      },
    },
    {
      $match: {
        overallRating: { $gte: 3.5 },
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "placeId",
        as: "images",
      },
    },
    {
      $addFields: {
        images: {
          $map: {
            input: "$images",
            as: "image",
            in: {
              _id: "$$image._id",
              image: "$$image.image",
            },
          },
        },
      },
    },
  ]);
};
