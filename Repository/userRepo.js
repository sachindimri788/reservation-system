const userModel = require("../Model/userModel");
const userInfoModel = require("../Model/userInfoModel");

exports.registerUser = async (userData) => {
  return await userModel.create(userData);
};

exports.isMailExists = async (email) => {
  return await userModel.countDocuments({ email });
};

exports.userDetails = async (_id) => {
  return await userModel.findOne({ _id });
};

exports.updateProfile = async (userInfo, userId) => {
  return await userInfoModel.updateOne({ userId }, { $set: userInfo });
};

exports.userDetailsByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.addUserInUserInfo = async (userId) => {
  return await userInfoModel.create({ userId });
};

exports.userInfoDetails = async (userId) => {
  return await userInfoModel.findOne({ userId }).populate("userId");
};

exports.makeUserHost = async (userId) => {
  return await userModel.updateOne(
    { _id: userId },
    { $set: { userType: "host" } }
  );
};
