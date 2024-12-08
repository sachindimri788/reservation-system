const { successResponse } = require("../Utils/response");
const validationSchema = require("../Utils/validationSchema");
const userRepo = require("../Repository/userRepo");
const path = require("path");

exports.updateProfile = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.updateProfile.validate(req.body);
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  if (req.files) {
    const uploadPath = path.join(
      __dirname,
      "..",
      "Public",
      "image",
      req.files.image.name
    );
    await req.files.image.mv(uploadPath);
    await userRepo.updateProfile(
      { ...value, image: uploadPath },
      res.locals.userId
    );
  } else {
    await userRepo.updateProfile(value, res.locals.userId);
  }
  responseResult.message = "Profile Updated";
  return res.status(200).json(responseResult);
};

exports.getProfile = async (req, res) => {
  const responseResult = { ...successResponse };
  const userInfo = await userRepo.userInfoDetails(res.locals.userId);
  responseResult.data = {
    userName: userInfo.userId.name,
    userEmail: userInfo.userId.email,
    image: userInfo.image,
    phoneNumber: userInfo.phoneNumber,
    address: userInfo.address,
    userType: userInfo.userId.userType,
  };
  return res.status(200).json(responseResult);
};

exports.becomeHost = async (req, res) => {
  const responseResult = { ...successResponse };
  await userRepo.makeUserHost(res.locals.userId);
  responseResult.message = "Updated";
  return res.status(200).json(responseResult);
};
