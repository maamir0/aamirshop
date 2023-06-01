const { User } = require("../models/user.model");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { findUserByEmailOrPhone } = require("../utils/findUserByEmail");

const otpVerifcation = catchAsync(async (req, res, next) => {
  const { otp, email, phone } = req.body;
  if (!otp) {
    return next(new AppError(400, "please enter  OTP"));
  }
  const user = await User.findOne({
    email,
  })
    .select("+otp +otpExpiresIn")
    .exec();
  if (!user) return next(new AppError(404, "Invalid Credentials"));

  req.isOTPValid = user.verifyOTP(otp);
  req.user = user;
  next();
});

module.exports = {
  otpVerifcation,
};
