const { catchAsync } = require("../utils/catchAsync");
const { User } = require("../models/user.model");
const AuthServices = require("../services/auth.services");
const AppError = require("../utils/appError");

const protectRoute = catchAsync(async (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return next(new AppError(401, "Please provide token: login to get token"));

  const token = bearerToken.split(" ")[1];
  const payload = AuthServices.verifyJwt(token);

  const user = await User.findById(payload.uid).select(
    "+isPasswordChanged +passwordChangedAt +role"
  );
  if (!user) {
    return next(new AppError(401, "No User Found with this token"));
  }
  if (user.isPasswordChanged) {
    if (
      new Date(user.passwordChangedAt).getTime() / 1000 >
      Number.parseInt(payload.iat)
    ) {
      return next(
        new AppError(401, "You have changed your password please login again")
      );
    }
  }
  req.user = user;

  next();
});

const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      if (req.originalUrl.endsWith("shop") && req.method == "POST") {
        return next(new AppError(401, "you already have a shop"));
      }
      return next(
        new AppError(401, "you dont have permission to access this route")
      );
    }
    next();
  });
};

module.exports = {
  protectRoute,
  restrictTo,
};
