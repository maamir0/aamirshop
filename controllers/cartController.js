const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const usersArrayManager = require("../utils/usersArrayManager");
const addItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.addOne(req, res, next, "cart", Product, AppError);
});

const removeItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteOne(req, res, next, "cart", Product, AppError);
});

const removeAll = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteAll(req, res, next, "cart", Product, AppError);
});

const getCart = catchAsync(async (req, res, next) => {
  await usersArrayManager.getAll(req, res, next, "cart", Product, AppError);
});

const removeMany = catchAsync(async (req, res, next) => {
  await usersArrayManager.deleteMany(req, res, next, "cart", Product, AppError);
});
const toggleItem = catchAsync(async (req, res, next) => {
  await usersArrayManager.toggle(req, res, next, "cart", Product, AppError);
});

const isInCart = catchAsync(async (req, res, next) => {
  console.log(req.params);
  await usersArrayManager.getOne(req, res, next, "cart", Product, AppError);
});

module.exports = {
  addItem,
  removeItem,
  getCart,
  removeAll,
  removeMany,
  toggleItem,
  isInCart,
};
