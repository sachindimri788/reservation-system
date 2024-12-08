const express = require("express");
const router = express.Router();
const placeController = require("../Controller/placeController");
const userType = require("../Middleware/userType");
const { asyncErrorHandler } = require("../Utils/response");

router.post("/", userType.isHost, asyncErrorHandler(placeController.addPlace));

router.get(
  "/",
  userType.isHost,
  asyncErrorHandler(placeController.getAllPlaces)
);

router.delete(
  "/:placeId",
  userType.isHost,
  asyncErrorHandler(placeController.deletePlace)
);

router.put(
  "/:placeId",
  userType.isHost,
  asyncErrorHandler(placeController.updatePlace)
);

router.post(
  "/image/:placeId",
  userType.isHost,
  asyncErrorHandler(placeController.addPlaceImages)
);

router.delete(
  "/image/:imageId",
  userType.isHost,
  asyncErrorHandler(placeController.deletePlaceImage)
);

router.get(
  "/image/:placeId",
  userType.isHost,
  asyncErrorHandler(placeController.getPlaceImage)
);

module.exports = router;
