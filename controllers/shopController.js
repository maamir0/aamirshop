const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const mongoose = require("mongoose");
const usersArrayManager = require("../utils/usersArrayManager");
const { filterUndefinedObj } = require("../utils/fiterUndefinedObj");

const createShop = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log(user.role);
  const { name, description, coverPic, profilePic, isPublic } = req.body;
  console.log(Boolean(isPublic));
  if (typeof Boolean(isPublic) !== "boolean")
    return next(new AppError(400, "isPublic field should be boolean"));
  const shop = await Shop.create({
    name,
    description,
    coverPic,
    profilePic,
    sellerId: user._id,
    isPublic,
  });

  if (shop) {
    user.role = "seller";
    await user.save();
  }

  res.status(200).json({
    status: "success",
    data: shop,
  });
});

const deleteShop = catchAsync(async (req, res, next) => {
  const user = req.user;
  await Shop.findOneAndDelete({ sellerId: user._id });

  user.role = user.role !== "admin" ? "user" : "admin";
  await user.save();

  res.status(204).json({
    status: "success",
  });
});

const getMyShop = catchAsync(async (req, res, next) => {
  const user = req.user;
  const shop = await Shop.findOne({ sellerId: user._id });

  if (!shop) return next(new AppError(404, "You dont have shop!"));

  res.status(200).json({
    status: "success",
    data: shop,
  });
});
const getAllShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.find({ isPublic: true });

  res.status(200).json({
    status: "success",
    data: shops,
  });
});

const updateShop = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { name, description, coverPic, profilePic, isPublic } = req.body;

  if (isPublic && typeof Boolean(isPublic) !== "boolean")
    return next(new AppError(400, "isPublic field should be boolean"));

  const updatedData = {
    name,
    description,
    coverPic,
    profilePic,
    isPublic,
  };

  const filteredUpdateData = filterUndefinedObj(updatedData);

  const shop = await Shop.findOneAndUpdate(
    { sellerId: user._id },
    filteredUpdateData,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: shop,
  });
});

module.exports = {
  createShop,
  deleteShop,
  getMyShop,
  getAllShops,
  updateShop,
};
