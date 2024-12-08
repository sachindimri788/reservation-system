const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

exports.loginValidation = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required().min(4).trim(),
});

exports.registrationValidation = Joi.object({
  name: Joi.string().min(3).max(30).required().trim(),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required().min(4).trim(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .min(4)
    .trim()
    .messages({
      "any.only": '"confirmPassword" must match "password"',
    }),
  userType: Joi.string().valid("host", "guest").required(),
}).with("password", "confirmPassword");

exports.addPlaceValidation = Joi.object({
  title: Joi.string().trim().required(),
  subTitle: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
  location: Joi.string().trim().required(),
  dailyDiscount: Joi.number().required(),
  weeklyDiscount: Joi.number().required(),
  cleaningFee: Joi.number().required(),
  serviceFee: Joi.number().required(),
  capacity: Joi.number().required(),
  amenities: Joi.array().items(Joi.string()),
  city: Joi.string().trim().required(),
  postalCode: Joi.number().required(),
  country: Joi.string().trim().required(),
});

exports.updatePlaceValidation = Joi.object({
  title: Joi.string().trim().required(),
  subTitle: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().required(),
  location: Joi.string().trim().required(),
  dailyDiscount: Joi.number().required(),
  weeklyDiscount: Joi.number().required(),
  cleaningFee: Joi.number().required(),
  serviceFee: Joi.number().required(),
  capacity: Joi.number().required(),
  amenities: Joi.array().items(Joi.string()),
  city: Joi.string().trim().required(),
  postalCode: Joi.number().required(),
  country: Joi.string().trim().required(),
  placeId: JoiObjectId().required(),
});

exports.updateProfile = Joi.object({
  image: Joi.binary(),
  address: Joi.string().trim(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
});

exports.addRatingValidation = Joi.object({
  placeId: JoiObjectId().required(),
  ratingMessage: Joi.string().trim().optional(),
  cleanliness: Joi.number().min(1).max(5).required(),
  detailMentioned: Joi.number().min(1).max(5).required(),
  communication: Joi.number().min(1).max(5).required(),
  location: Joi.number().min(1).max(5).required(),
  checkIn: Joi.number().min(1).max(5).required(),
  valueForMoney: Joi.number().min(1).max(5).required(),
});

exports.updateRatingValidation = Joi.object({
  placeId: JoiObjectId().required(),
  ratingMessage: Joi.string().trim().optional(),
  cleanliness: Joi.number().min(1).max(5).required(),
  detailMentioned: Joi.number().min(1).max(5).required(),
  communication: Joi.number().min(1).max(5).required(),
  location: Joi.number().min(1).max(5).required(),
  checkIn: Joi.number().min(1).max(5).required(),
  valueForMoney: Joi.number().min(1).max(5).required(),
  ratingId: JoiObjectId().required(),
});

exports.searchPlacesValidation = Joi.object({
  pageNumber: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  checkInDate: Joi.date().iso().required(),
  checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).required(),
  location: Joi.string().trim().required(),
  numberOfGuest: Joi.number().integer().min(1).required(),
});

exports.bookingStatusValidation = Joi.object({
  bookingId: JoiObjectId().required(),
  status: Joi.string().trim().valid("pending", "accept", "decline").required(),
});

exports.searchGetPlaceValidation = Joi.object({
  placeId: JoiObjectId().required(),
  numberOfGuest: Joi.number().integer().min(1).required(),
  checkInDate: Joi.date().iso().required(),
  checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).required(),
});

exports.bookPlaceValidation = Joi.object({
  placeId: JoiObjectId().required(),
  transactionId: JoiObjectId().required(),
  numberOfGuest: Joi.number().integer().min(1).required(),
  bookingFromDate: Joi.date().iso().required(),
  bookingToDate: Joi.date()
    .iso()
    .greater(Joi.ref("bookingFromDate"))
    .required(),
});

exports.paymentValidation = Joi.object({
  bookingFromDate: Joi.date().iso().required(),
  bookingToDate: Joi.date()
    .iso()
    .greater(Joi.ref("bookingFromDate"))
    .required(),
  numberOfGuest: Joi.number().integer().min(1).required(),
  placeId: JoiObjectId().required(),
  title: Joi.string().trim().required(),
});
