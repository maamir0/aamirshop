const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const AuthServices = require("../services/auth.services");
const AppError = require("../utils/appError");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {
        return emailValidator.validate(value);
      },
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    minLength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
    select: false,
  },
  shippingAddresses: [
    {
      title: { type: String, required: true },
      country: { type: String, required: true },
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
      phone: { type: Number, required: true },
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  otp: {
    type: String,
    select: false,
  },
  otpExpiresIn: {
    type: Date,
    select: false,
  },
  isPasswordChanged: {
    type: Boolean,
    default: false,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: null,
    select: false,
  },
  isVerified: { type: Boolean, default: false },
});
// Validations

// Hooks

UserSchema.pre("save", function (next) {
  if (this.isModified("otp") && !this.isNew) return next();
  if (!this.isNew) return next();
  if (!this.password && !this.googleId && !this.facebookId)
    return next(
      new AppError(400, "password or googleId or facebookId required")
    );
  next();
});
UserSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await AuthServices.hashPassword(this.password);
  return next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("otp")) return next();
  if (this.skipOtpHash) return next();
  this.otp = crypto.createHash("sha256").update(this.otp).digest("hex");
  this.otpExpiresIn = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  return next();
});

// Methods

UserSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.verifyOTP = function (otp) {
  const expiry = new Date(this.otpExpiresIn).getTime();
  if (expiry < Date.now()) return false;
  return this.otp == crypto.createHash("sha256").update(otp).digest("hex");
};

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
