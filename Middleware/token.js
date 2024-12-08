const jwt = require("jsonwebtoken");
const { successResponse } = require("../Utils/response");
const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const responseResult = { ...successResponse };
  const bearerHeader = req.header("authorization");
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        responseResult.message = "Invalid token";
        responseResult.statusCode = 403;
        res.status(403).json(responseResult);
      } else {
        const userId = decoded?.user.userId;
        const userEmail = decoded?.user.userEmail;
        res.locals.userId = userId;
        res.locals.userEmail = userEmail;
        next();
      }
    });
  } else {
    responseResult.message = "Token is not provided";
    responseResult.statusCode = 403;
    res.status(403).json(responseResult);
  }
};

const generateToken = (user) => {
  const payload = { user };
  return jwt.sign(payload, secretKey);
};

module.exports = { verifyToken, generateToken };
