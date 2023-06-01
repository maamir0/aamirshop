const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const usersArrayManager = require("../utils/usersArrayManager");
const { User } = require("../models/user.model");
const addToShippingAddress = catchAsync(async (req, res, next) => {
  await usersArrayManager.addOne(
    req,
    res,
    next,
    "shippingAddresses",
    Product,
    AppError
  );
});
const getShippingAddress = catchAsync(async (req, res, next) => {
  await usersArrayManager.getAll(
    req,
    res,
    next,
    "shippingAddresses",
    Product,
    AppError
  );
});
const deleteAddress = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteOne(
    req,
    res,
    next,
    "shippingAddresses",
    User,
    AppError
  );
});

module.exports = {
  addToShippingAddress,
  getShippingAddress,
  deleteAddress,
};
