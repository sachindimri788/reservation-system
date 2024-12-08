const express = require("express");
const router = express.Router();
const searchPlaceController = require("../Controller/searchPlaceController");
const { asyncErrorHandler } = require("../Utils/response");

router.get("/", asyncErrorHandler(searchPlaceController.getAvailablePlaces));

router.get(
  "/placeAmountInfo/:placeId",
  asyncErrorHandler(searchPlaceController.getPlace)
);

router.get(
  "/recommendation",
  asyncErrorHandler(searchPlaceController.placeRecommendation)
);

module.exports = router;
