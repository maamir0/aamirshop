const AppError = require("../utils/appError");

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went realy wrong",
    });
  }
};
const sendDevError = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

function globalErrorHandler(err, req, res, next) {
  if (process.env.NODE_ENV == "development") {
    sendDevError(err, res);
  }

  if (process.env.NODE_ENV == "production") {
    let error = err;
    console.log(error);
    if (error.code == 11000 && "email" in error.keyValue)
      error = new AppError(409, "Email is already registred");
    if (error.code == 11000 && "phone" in error.keyValue)
      error = new AppError(409, "Phone number is already registred");
    if (error.name == "CastError")
      error = new AppError(404, `Invalid field ${err.path}`);
    if (error.name == "JsonWebTokenError")
      error = new AppError(404, "Invalid Token");
    if (error.name == "TokenExpiredError")
      error = new AppError(404, "Your Token is expired please login again");
    if (error.name == "ValidationError")
      error = new AppError(404, error.message);
    sendProdError(error, res);
  }
}

module.exports = { globalErrorHandler };
