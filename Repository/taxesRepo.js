const taxModel = require("../Model/taxModel");

exports.getAllTaxes = async () => {
  return await taxModel.find();
};
