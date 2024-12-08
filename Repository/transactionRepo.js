const transactionModel = require("../Model/transactionModel");

exports.createTransaction = async (placeId, sessionId, guestId, amount) => {
  return await transactionModel.create({ placeId, sessionId, guestId, amount });
};

exports.updateTransactionStatus = async (sessionId, status, amount) => {
  return await transactionModel.updateOne(
    { sessionId },
    { $set: { status, amount } }
  );
};

exports.isTransactionPaid = async (transactionId) => {
  return await transactionModel.countDocuments({
    _id: transactionId,
    status: "paid",
  });
};
