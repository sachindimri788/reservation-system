const validationSchema = require("../Utils/validationSchema");
const userRepo = require("../Repository/userRepo");
const bcrypt = require("bcrypt");
const { successResponse } = require("../Utils/response");
const { generateToken } = require("../Middleware/token");

exports.register = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.registrationValidation.validate(
    req.body
  );
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const isMailExists = await userRepo.isMailExists(value.email);
  if (isMailExists) {
    responseResult.message = "email Already Exists";
    return res.status(409).json(responseResult);
  }
  const hashPassword = await bcrypt.hash(value.password, 10);
  const userInfo = await userRepo.registerUser({
    ...value,
    password: hashPassword,
  });
  await userRepo.addUserInUserInfo(userInfo._id);
  responseResult.token = generateToken({
    userId: userInfo._id,
    userEmail: userInfo.email,
  });
  responseResult.data = {
    userName: userInfo.name,
    userEmail: userInfo.email,
    userType: userInfo.userType,
  };
  responseResult.message = "User Created";
  return res.status(201).json(responseResult);
};

exports.login = async (req, res) => {
  const responseResult = { ...successResponse };
  const { error, value } = validationSchema.loginValidation.validate(req.body);
  if (error) {
    responseResult.message = error.message;
    return res.status(403).json(responseResult);
  }
  const exist = await userRepo.isMailExists(value.email);
  if (!exist) {
    responseResult.message = "email Not Exists";
    return res.status(409).json(responseResult);
  }
  const userInfo = await userRepo.userDetailsByEmail(value.email);
  const isCorrectPassword = await bcrypt.compare(
    value.password,
    userInfo.password
  );
  if (!isCorrectPassword) {
    responseResult.message = "invalid Password";
    return res.status(401).json(responseResult);
  }
  responseResult.token = generateToken({
    userId: userInfo._id,
    userEmail: userInfo.email,
  });
  responseResult.data = {
    userName: userInfo.name,
    userEmail: userInfo.email,
    userType: userInfo.userType,
  };
  return res.status(200).json(responseResult);
};
