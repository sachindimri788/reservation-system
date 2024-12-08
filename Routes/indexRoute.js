const express = require("express");
const router = express.Router();
const authRoute = require("./authRoute");
const placeRoute = require("./placeRoute");
const profileRoute = require("./profileRoute");
const ratingRoute = require("./ratingRoute");
const searchPlaceRoute = require("./searchPlaceRoute");
const bookingRoute = require("./bookingRoute");
const { verifyToken } = require("../Middleware/token");
const limiter = require("../Middleware/rateLimiter");

router.use("/v1/auth", limiter, authRoute);
router.use("/v1/place", verifyToken, placeRoute);
router.use("/v1/profile", limiter, verifyToken, profileRoute);
router.use("/v1/rating", limiter, verifyToken, ratingRoute);
router.use("/v1/searchPlace", limiter, verifyToken, searchPlaceRoute);
router.use("/v1/booking", limiter, verifyToken, bookingRoute);

module.exports = router;
