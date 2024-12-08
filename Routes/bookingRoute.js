const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/bookingController");
const { asyncErrorHandler } = require("../Utils/response");
const userType = require("../Middleware/userType");

router.post("/bookPlace", asyncErrorHandler(bookingController.bookPlace));

router.get(
  "/getPlaceBooking/:placeId",
  userType.isHost,
  asyncErrorHandler(bookingController.getPlaceBookingInfo)
);

router.post(
  "/bookingStatus",
  userType.isHost,
  asyncErrorHandler(bookingController.bookingStatus)
);

router.post("/payment", asyncErrorHandler(bookingController.payment));

router.get(
  "/getGuestBooking/:guestId",
  asyncErrorHandler(bookingController.getGuestBookingInfo)
);

module.exports = router;
