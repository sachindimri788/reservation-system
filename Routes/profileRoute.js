const express = require("express");
const router = express.Router();
const profileController = require("../Controller/profileController");
const { asyncErrorHandler } = require("../Utils/response");

router.post(
  "/updateProfile",
  asyncErrorHandler(profileController.updateProfile)
);
router.get("/", asyncErrorHandler(profileController.getProfile));
router.get("/becomeHost", asyncErrorHandler(profileController.becomeHost));

module.exports = router;
