const express = require("express");
const router = express.Router();
const ratingController = require("../Controller/ratingController");
const { asyncErrorHandler } = require("../Utils/response");
const userType = require("../Middleware/userType");

router.post(
  "/",
  userType.isGuest,
  asyncErrorHandler(ratingController.addRating)
);

router.get("/", asyncErrorHandler(ratingController.getRating));

router.put(
  "/:ratingId",
  userType.isGuest,
  asyncErrorHandler(ratingController.updateRating)
);

module.exports = router;
