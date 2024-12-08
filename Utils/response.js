exports.successResponse = {
  status: true,
  message: "Success",
  data: [],
};

exports.errorHandler = (err, req, res, next) => {
  const serverErrorResponse = {
    status: false,
    message: "Internal Server Error",
  };
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json(serverErrorResponse);
};

exports.asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};
