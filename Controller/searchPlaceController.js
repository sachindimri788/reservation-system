const placeRepo = require("../Repository/placeRepo");
const bookingRepo = require("../Repository/bookingRepo");
const taxesRepo = require("../Repository/taxesRepo");
const validationSchema = require("../Utils/validationSchema");
const { successResponse } = require("../Utils/response");

exports.getAvailablePlaces = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.searchPlacesValidation.validate(
    req.query
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const checkIn = new Date(value.checkInDate);
  const checkOut = new Date(value.checkOutDate);
  checkIn.setHours(13, 0, 0, 0);
  checkOut.setHours(11, 0, 0, 0);
  checkIn.setTime(checkIn.getTime() + 5.5 * 60 * 60 * 1000);
  checkOut.setTime(checkOut.getTime() + 5.5 * 60 * 60 * 1000);

  const bookedPlaces = await bookingRepo.bookedPlacesIds(checkIn, checkOut);
  const fullyBookedPlaceIds = bookedPlaces
    .filter(
      (place) =>
        place.totalGuests + Number(value.numberOfGuest) >= place.capacity
    )
    .map((place) => place._id);

  const availablePlaces = await placeRepo.searchAvailablePlaces(
    value.pageNumber,
    value.limit,
    fullyBookedPlaceIds,
    value.location,
    value.numberOfGuest
  );
  responseResult.data = availablePlaces;
  return res.status(200).json(responseResult);
};

exports.getPlace = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.searchGetPlaceValidation.validate({
    ...req.query,
    placeId: req.params.placeId,
  });
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  if (!(await placeRepo.isPlaceExists(value.placeId))) {
    responseResult.message = "Place not found";
    return res.status(404).json(responseResult);
  }
  const placeInfo = await placeRepo.getPlaceById(value.placeId);
  const noOfDaysStay = Math.round(
    (value.checkOutDate - value.checkInDate) / (1000 * 3600 * 24)
  );
  let finalPrice;
  if (noOfDaysStay >= 5) {
    finalPrice =
      placeInfo.price *
        noOfDaysStay *
        value.numberOfGuest *
        (1 + 0.02 * value.numberOfGuest) -
      placeInfo.weeklyDiscount +
      placeInfo.cleaningFee +
      placeInfo.serviceFee;
  } else {
    finalPrice =
      placeInfo.price *
        noOfDaysStay *
        value.numberOfGuest *
        (1 + 0.02 * value.numberOfGuest) -
      placeInfo.dailyDiscount +
      placeInfo.cleaningFee +
      placeInfo.serviceFee;
  }
  const taxes = await taxesRepo.getAllTaxes();
  taxes.map((tax) => (finalPrice = finalPrice + finalPrice * (tax.rate / 100)));

  responseResult.data = {
    placeId: placeInfo._id,
    title: placeInfo.title,
    subTitle: placeInfo.subTitle,
    description: placeInfo.description,
    location: placeInfo.location,
    city: placeInfo.city,
    postalCode: placeInfo.postalCode,
    country: placeInfo.country,
    price: placeInfo.price,
    dailyDiscount: placeInfo.dailyDiscount,
    amenities: placeInfo.amenities,
    weeklyDiscount: placeInfo.weeklyDiscount,
    cleaningFee: placeInfo.cleaningFee,
    serviceFee: placeInfo.serviceFee,
    capacity: placeInfo.capacity,
    hostId: placeInfo.hostId,
  };
  responseResult.taxes = taxes;
  responseResult.finalPrice = finalPrice.toFixed(2);
  return res.status(200).json(responseResult);
};

exports.placeRecommendation = async (req, res) => {
  const responseResult = { ...successResponse };
  const { location } = req.query;
  responseResult.data = await placeRepo.recommendedPlaces(location);
  return res.status(200).json(responseResult);
};
