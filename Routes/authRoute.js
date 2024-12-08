const express = require("express");
const router = express.Router();
const authController = require("../Controller/authController");
const { asyncErrorHandler } = require("../Utils/response");

router.post("/register", asyncErrorHandler(authController.register));
router.post("/login", asyncErrorHandler(authController.login));

module.exports = router;
