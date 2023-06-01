const mongoose = require("mongoose");
const { User } = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync");
const AuthServices = require("../services/auth.services");
const { sendResponse } = require("../utils/responseObject");
const AppError = require("../utils/appError");
const { findUserByEmail } = require("../utils/findUserByEmail");
const twilio = require("twilio");

const signUpWithEmail = catchAsync(async (req, res) => {
  const { email, password, name, phone, address } = req.body;
  console.log(req.body);
  const otp = AuthServices.generateOTP().toString();
  const profilePic = req.file?.path.split("public")[1];
  const newUser = new User({
    email,
    password,
    name,
    phone,
    address,
    otp,
    profilePic,
  });
  console.log("reached there");
  await newUser.save();
  await AuthServices.sendOTP(res, email, otp);
  res.status(201).json({
    status: "success",
    message: "Otp sent to your email Please verify",
  });
});

const loginWithEmail = catchAsync(async (req, res, next) => {
  const user = await AuthServices.verifyPassword(User, req.body, next);
  if (user) {
    const token = AuthServices.generateToken(user._id);
    user.password = undefined;
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user,
      token,
    });
  } else {
    next(new AppError(401, "Invalid credentials"));
  }
});

const verifyUser = catchAsync(async (req, res, next) => {
  const { email, phone } = req.body;
  const user = await findUserByEmail(
    User,
    email,
    phone,
    "+otp +otpExpiresIn",
    next
  );

  if (req.isOTPValid) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresIn = undefined;
    user.skipOtpHash = true;
    await user.save();
    const token = AuthServices.generateToken(user._id);
    user.isVerified = undefined;
    res.status(200).json({
      status: "success",
      message: "User verified",
      user,
      token,
    });
  } else {
    return next(new AppError(401, "Invalid otp or otp expired"));
  }
});

const resendOTP = catchAsync(async (req, res, next) => {
  const { email, phone } = req.body;

  const user = await findUserByEmail(
    User,
    email,
    phone,
    "+otp +otpExpiresIn",
    next
  );
  const otp = AuthServices.generateOTP().toString();
  user.otp = otp;
  await user.save({ validateBeforeSave: false });
  await AuthServices.sendOTP(res, email, otp);

  res.status(200).json({
    status: "success",
    message: "Otp sent",
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email, phone } = req.body;

  const user = await findUserByEmail(
    User,
    email,
    phone,
    "+otp +otpExpiresIn",
    next
  );

  if (!user.isVerified) {
    return next(new AppError(401, "Please verify your account"));
  }
  const otp = AuthServices.generateOTP().toString();
  user.otp = otp;
  await user.save();
  await AuthServices.sendOTP(res, email, otp);

  res.status(200).json({
    status: "success",
    message: "Otp sent",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword) {
    return next(new AppError(404, "please enter new passwword"));
  }
  const user = req.user;
  if (!user.isVerified) {
    return next(new AppError(401, "Please verify your account"));
  }
  if (req.isOTPValid) {
    await updatePassword(user, newPassword).save();
    res.status(200).json({
      status: "success",
      message: "password updated",
    });
  }
  if (!req.isOTPValid) {
    return next(new AppError(401, "Otp is invalid or expired"));
  }
});

const changePassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  const user = await AuthServices.verifyPassword(User, req.body, next);
  if (user) {
    await updatePassword(user, newPassword).save();
    res.status(200).json({
      status: "success",
      message: "Password changed",
    });
  }
});

function updatePassword(user, newPassword) {
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiresIn = undefined;
  user.isPasswordChanged = true;
  user.passwordChangedAt = Date.now();
  user.skipOtpHash = true;
  return user;
}

const verifyOTP = catchAsync(async (req, res, next) => {
  if (!req.isOTPValid) {
    return next(new AppError(401, "Otp is invalid or expired"));
  }
  if (req.isOTPValid) {
    res.status(200).json({
      status: "success",
      message: "Otp verified",
    });
  }
});

module.exports = {
  signUpWithEmail,
  loginWithEmail,
  verifyUser,
  resendOTP,
  forgotPassword,
  resetPassword,
  verifyOTP,
  changePassword,
};
