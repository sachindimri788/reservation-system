const { successResponse } = require("../Utils/response");
const validationSchema = require("../Utils/validationSchema");
const placeRepo = require("../Repository/placeRepo");
const imageRepo = require("../Repository/imageRepo");
const ratingRepo = require("../Repository/ratingRepo");
const path = require("path");
const mongoose = require("mongoose");

exports.addPlace = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.addPlaceValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const totalNuberPlacesAssociate =
    await placeRepo.countNumberOfPlacesAssociated(res.locals.userId);
  if (totalNuberPlacesAssociate <= 10) {
    if (await placeRepo.isTitleExists(value.title)) {
      responseResult.message = "title already exists";
      return res.status(409).json(responseResult);
    }
    const placeData = await placeRepo.addPlace({
      ...value,
      hostId: res.locals.userId,
    });
    responseResult.data = placeData;
    responseResult.message = "Place Added";
    return res.status(201).json(responseResult);
  } else {
    responseResult.message = "limit exceed You can add places upto 10 only";
    return res.status(429).json(responseResult);
  }
};

exports.getAllPlaces = async (req, res) => {
  const responseResult = { ...successResponse };
  const { pageNumber, limit } = req.query;
  const hostPlacesList = await placeRepo.getAllHostPlaces(
    res.locals.userId,
    pageNumber,
    limit
  );
  const totalNumberHostPlaces = await placeRepo.countTotalNumberHostPlaces(
    res.locals.userId
  );
  responseResult.data = hostPlacesList;
  responseResult.totalHostPlaces = totalNumberHostPlaces;
  return res.status(200).json(responseResult);
};

exports.deletePlace = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.params.placeId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  const deleteInfo = await placeRepo.deleteHostPlace(req.params.placeId);
  if (deleteInfo.deletedCount === 0) {
    responseResult.message = "Not Found";
    return res.status(404).json(responseResult);
  }
  await imageRepo.deletePlaceAllImages(req.params.placeId);
  await ratingRepo.deletePlaceAllRating(req.params.placeId);
  responseResult.message = "deleted";
  return res.status(204).json(responseResult);
};

exports.updatePlace = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.updatePlaceValidation.validate({
    ...req.body,
    placeId: req.params.placeId,
  });
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  if (
    await placeRepo.isTitleExistsExceptTheCurrentPlace(
      value.title,
      req.params.placeId
    )
  ) {
    responseResult.message = "title already exists";
    return res.status(409).json(responseResult);
  }
  const updateInfo = await placeRepo.updateHostPlace(req.params.placeId, value);
  if (updateInfo.matchedCount === 0) {
    responseResult.message = "Place Not Found";
    return res.status(404).json(responseResult);
  }
  responseResult.message = "Updated";
  return res.status(200).json(responseResult);
};

exports.addPlaceImages = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!req.files) {
    responseResult.message = "Image Not Found";
    return res.status(404).json(responseResult);
  }
  const images = Array.isArray(req.files.placeImage)
    ? req.files.placeImage
    : [req.files.placeImage];

  const imageUrl = await Promise.all(
    images.map(async (image) => {
      const uploadPath = path.join(
        __dirname,
        "..",
        "Public",
        "image",
        image.name
      );
      await image.mv(uploadPath);
      return {
        image: uploadPath,
        placeId: req.params.placeId,
        hostId: res.locals.userId,
      };
    })
  );
  responseResult.message = "Added";
  await imageRepo.savePlaceImageUrl(imageUrl);
  return res.status(201).json(responseResult);
};

exports.deletePlaceImage = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  const deleteInfo = await imageRepo.deletePlaceImage(req.params.imageId);
  if (deleteInfo.deletedCount === 0) {
    responseResult.message = "Not Found";
    return res.status(404).json(responseResult);
  }
  responseResult.message = "deleted";
  return res.status(204).json(responseResult);
};

exports.getPlaceImage = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.params.placeId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  if (!(await placeRepo.isPlaceExists(req.params.placeId))) {
    responseResult.message = "Place not found";
    return res.status(404).json(responseResult);
  }
  responseResult.data = await imageRepo.getPlaceImage(req.params.placeId);
  return res.status(200).json(responseResult);
};
