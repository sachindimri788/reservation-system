const { successResponse, asyncErrorHandler } = require("../Utils/response");
const userRepo = require("../Repository/userRepo");

// eslint-disable-next-line consistent-return
exports.isHost = asyncErrorHandler(async (req, res, next) => {
  const responseResult = { ...successResponse };
  const userInfo = await userRepo.userDetails(res.locals.userId);
  if (userInfo === null || userInfo.userType !== "host") {
    responseResult.message = "Unauthorized";
    return res.status(403).json(responseResult);
  }
  next();
});

// eslint-disable-next-line consistent-return
exports.isGuest = asyncErrorHandler(async (req, res, next) => {
  const responseResult = { ...successResponse };
  const userInfo = await userRepo.userDetails(res.locals.userId);
  if (userInfo === null || userInfo.userType !== "guest") {
    responseResult.message = "Unauthorized";
    return res.status(403).json(responseResult);
  }
  next();
});
