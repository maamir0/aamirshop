const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const usersArrayManager = require("../utils/usersArrayManager");
const { User } = require("../models/user.model");
const addItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.addOne(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

const removeItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteOne(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

const removeAll = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteAll(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

const getFavorites = catchAsync(async (req, res, next) => {
  await usersArrayManager.getAll(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

const removeMany = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteMany(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});
const toggleItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.toggle(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

const isFavorite = catchAsync(async (req, res, next) => {
  console.log(req.params);
  await usersArrayManager.getOne(
    req,
    res,
    next,
    "favorites",
    Product,
    AppError
  );
});

module.exports = {
  addItem,
  removeItem,
  getFavorites,
  isFavorite,
  removeAll,
  removeMany,
  toggleItem,
};
