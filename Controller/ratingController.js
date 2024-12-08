const { successResponse } = require("../Utils/response");
const validationSchema = require("../Utils/validationSchema");
const ratingRepo = require("../Repository/ratingRepo");
const bookingRepo = require("../Repository/bookingRepo");
const mongoose = require("mongoose");

exports.addRating = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.addRatingValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  if (
    !(await bookingRepo.isGuestVisitedToPlace(res.locals.userId, value.placeId))
  ) {
    responseResult.message = "You can Give Rating After Visit";
    return res.status(403).json(responseResult);
  }
  if (
    await ratingRepo.isRatingAlreadyExists(res.locals.userId, value.placeId)
  ) {
    responseResult.message = "already rated";
    return res.status(409).json(responseResult);
  }
  const overallRating = (
    (value.cleanliness +
      value.detailMentioned +
      value.communication +
      value.location +
      value.checkIn +
      value.valueForMoney) /
    6
  ).toFixed(2);
  await ratingRepo.addRating({
    ...value,
    guestId: res.locals.userId,
    overallRating,
  });
  responseResult.message = "Added";
  return res.status(201).json(responseResult);
};

exports.getRating = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.query.placeId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  const placeRatingInfo = await ratingRepo.getRating(req.query.placeId);
  if (placeRatingInfo.length === 0) {
    responseResult.message = "Rating not Found";
    return res.status(404).json(responseResult);
  }
  responseResult.data = placeRatingInfo.map((rating) => {
    return {
      ratingId: rating._id,
      placeId: rating.placeId,
      ratingMessage: rating.ratingMessage,
      cleanliness: rating.cleanliness,
      detailMentioned: rating.detailMentioned,
      communication: rating.communication,
      location: rating.location,
      checkIn: rating.checkIn,
      valueForMoney: rating.valueForMoney,
      overallRating: rating.overallRating,
      createdAt: rating.createdAt,
    };
  });
  return res.status(200).json(responseResult);
};

exports.updateRating = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.updateRatingValidation.validate({
    ...req.body,
    ratingId: req.params.ratingId,
  });
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const overallRating = (
    (value.cleanliness +
      value.detailMentioned +
      value.communication +
      value.location +
      value.checkIn +
      value.valueForMoney) /
    6
  ).toFixed(2);
  const updateInfo = await ratingRepo.updateRating(
    { ...value, guestId: res.locals.userId, overallRating },
    req.params.ratingId
  );
  if (updateInfo.matchedCount === 0) {
    responseResult.message = "Rating Not Found";
    return res.status(404).json(responseResult);
  }
  responseResult.message = "Updated";
  return res.status(200).json(responseResult);
};
