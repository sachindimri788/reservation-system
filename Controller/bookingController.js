const bookingRepo = require("../Repository/bookingRepo");
const transactionRepo = require("../Repository/transactionRepo");
const placeRepo = require("../Repository/placeRepo");
const taxesRepo = require("../Repository/taxesRepo");
const mongoose = require("mongoose");
const { successResponse } = require("../Utils/response");
const validationSchema = require("../Utils/validationSchema");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.payment = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.paymentValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }

  const bookingFrom = new Date(value.bookingFromDate);
  const bookingTo = new Date(value.bookingToDate);
  bookingFrom.setHours(13, 0, 0, 0);
  bookingTo.setHours(11, 0, 0, 0);
  bookingFrom.setTime(bookingFrom.getTime() + 5.5 * 60 * 60 * 1000);
  bookingTo.setTime(bookingTo.getTime() + 5.5 * 60 * 60 * 1000);
  const bookedPlaces = await bookingRepo.bookedPlacesIds(
    bookingFrom,
    bookingTo
  );
  const fullyBookedPlaceIds = bookedPlaces
    .filter(
      (place) =>
        place.totalGuests + Number(value.numberOfGuest) >= place.capacity
    )
    .map((place) => String(place._id));

  if (fullyBookedPlaceIds.includes(value.placeId)) {
    responseResult.message = "Already Booked";
    return res.status(404).json(responseResult);
  }

  const placeInfo = await placeRepo.getPlaceById(value.placeId);
  const noOfDaysStay = Math.round(
    (bookingTo - bookingFrom) / (1000 * 3600 * 24)
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

  const product = await stripe.products.create({
    name: value.title,
  });
  const price = await stripe.prices.create({
    unit_amount: finalPrice * 100,
    currency: "inr",
    product: product.id,
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://example.com/success`,
    cancel_url: `http://example.com/cancel`,
  });
  const transaction = await transactionRepo.createTransaction(
    value.placeId,
    session.id,
    res.locals.userId,
    finalPrice
  );
  responseResult.data = {
    stripeUrl: session.url,
    transactionId: transaction._id,
  };
  return res.status(200).json(responseResult);
};

exports.bookPlace = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.bookPlaceValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  if (!(await transactionRepo.isTransactionPaid(value.transactionId))) {
    responseResult.message = "Pay Before Booking";
    return res.status(402).json(responseResult);
  }
  const bookingFrom = new Date(value.bookingFromDate);
  const bookingTo = new Date(value.bookingToDate);
  bookingFrom.setHours(13, 0, 0, 0);
  bookingTo.setHours(11, 0, 0, 0);
  bookingFrom.setTime(bookingFrom.getTime() + 5.5 * 60 * 60 * 1000);
  bookingTo.setTime(bookingTo.getTime() + 5.5 * 60 * 60 * 1000);
  const bookingInfo = await bookingRepo.bookPlace({
    ...value,
    bookingFrom,
    bookingTo,
    guestId: res.locals.userId,
  });
  responseResult.data = { bookingId: bookingInfo._id };
  return res.status(201).json(responseResult);
};

exports.getPlaceBookingInfo = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.params.placeId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  const bookingInfo = await bookingRepo.getBookingInfoByPlaceId(
    req.params.placeId
  );
  responseResult.data = bookingInfo;
  return res.status(200).json(responseResult);
};

exports.bookingStatus = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.bookingStatusValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const bookingInfo = await bookingRepo.getBookingInfoByBookingId(
    value.bookingId
  );
  if (bookingInfo.status === "decline" || bookingInfo.status === "accept") {
    responseResult.message = "Sorry You Cann't Change the Status";
    return res.status(403).json(responseResult);
  }
  const updateInfo = await bookingRepo.updateBookingStatus(
    value.bookingId,
    value.status
  );
  if (updateInfo.matchedCount === 0) {
    responseResult.message = "Booking Not Found";
    return res.status(404).json(responseResult);
  }
  responseResult.message = "Updated";
  return res.status(200).json(responseResult);
};

exports.getGuestBookingInfo = async (req, res) => {
  const responseResult = { ...successResponse };
  if (!mongoose.Types.ObjectId.isValid(req.params.guestId)) {
    responseResult.message = "Invalid Id";
    return res.status(403).json(responseResult);
  }
  const bookingInfo = await bookingRepo.getBookingInfoByGuestId(
    req.params.guestId
  );
  responseResult.data = bookingInfo;
  return res.status(200).json(responseResult);
};
