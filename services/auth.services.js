const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Mail = require("../services/email.services");
const { findUserByEmail } = require("../utils/findUserByEmail");
const AppError = require("../utils/appError");

const hashPassword = async (pass) => {
  return await bcrypt.hash(pass, parseInt(process.env.SALTROUND));
};

const generateToken = (id) => {
  return jwt.sign(
    {
      uid: id,
      iat: Math.floor(Date.now),
      exp: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
    },
    process.env.JWTPASSWORD
  );
};

const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 5; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const sendOTP = async (res, email, otp) => {
  try {
    console.log(email);
    await new Mail().sendOTP(email, otp);
  } catch (err) {
    console.log(err);
    res.status(421).json({
      status: "fail",
      message: "Error sending OTP ,Try later",
    });
  }
};

const verifyPassword = async (User, body, next) => {
  const { email, password, phone } = body;
  console.log(email, password);
  if (!password) {
    return next(new AppError(400, "please enter password"));
  }

  const user = await findUserByEmail(
    User,
    email,
    phone,
    "+password +role",
    next
  );

  console.log(user);

  if (!user.isVerified) {
    return next(new AppError(401, "Please verify your account"));
  }

  isAuthenticated = await user.isCorrectPassword(password);
  if (isAuthenticated) return user;
  return next(new AppError(404, "invalid credentials"));
};

const verifyJwt = (token) => {
  const payload = jwt.verify(token, process.env.JWTPASSWORD);
  return payload;
};

module.exports = {
  hashPassword,
  generateToken,
  generateOTP,
  sendOTP,
  verifyPassword,
  verifyJwt,
};
