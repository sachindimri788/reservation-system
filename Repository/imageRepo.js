const imageModel = require("../Model/imageModel");

exports.savePlaceImageUrl = async (userData) => {
  return await imageModel.create(userData);
};

exports.isImageIdExists = async (imageId) => {
  return await imageModel.countDocuments({ _id: imageId });
};

exports.deletePlaceImage = async (imageId) => {
  return await imageModel.deleteOne({ _id: imageId });
};

exports.deletePlaceAllImages = async (placeId) => {
  return await imageModel.deleteMany({ placeId });
};

exports.getPlaceImage = async (placeId) => {
  return await imageModel.find({ placeId });
};
