const ratingModel = require("../Model/ratingModel");

exports.isRatingAlreadyExists = async (userId, placeId) => {
  return await ratingModel.countDocuments({ guestId: userId, placeId });
};

exports.addRating = async (ratingInfo) => {
  return await ratingModel.create(ratingInfo);
};

exports.getRating = async (placeId) => {
  return await ratingModel.find({ placeId });
};

exports.updateRating = async (ratingInfo, ratingId) => {
  return await ratingModel.updateOne({ _id: ratingId }, { $set: ratingInfo });
};

exports.deletePlaceAllRating = async (placeId) => {
  return await ratingModel.deleteMany({ placeId });
};
