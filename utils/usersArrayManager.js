const { catchAsync } = require("./catchAsync");
const AppError = require("./appError");
const Model = require("../models/product.model");
const mongoose = require("mongoose");
async function addOne(req, res, next, fieldName, Model, AppError) {
  const user = req.user;
  console.log(user);
  if (fieldName == "shippingAddresses") {
    user[fieldName].push(req.body);
  } else {
    const { productId } = req.params;

    const index = user[fieldName].findIndex((item) => item == productId);
    if (index >= 0) {
      return next(new AppError(404, "item is already in cart"));
    } else {
      const product = await Model.findById(productId);
      if (!product)
        return next(
          new AppError(
            404,
            "There is no product with this id or product is deleted by seller"
          )
        );
      user[fieldName].push(productId);
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "added",
  });
}

async function deleteOne(req, res, next, fieldName, Model, AppError) {
  if (fieldName == "shippingAddresses") {
    req.user.shippingAddresses = req.user.shippingAddresses.filter((data) => {
      return data._id != req.params.id;
    });
    await req.user.save({ validateBeforeSave: false });

    res.status(204).json({
      status: "success",
    });
  } else {
    const { productId } = req.params;

    const user = req.user;

    const index = user[fieldName].findIndex((item) => item == productId);

    if (index == -1) {
      return next(new AppError(404, "item not found"));
    } else {
      user[fieldName].splice(index, 1);
    }

    const foundedProducts = await Model.find({
      _id: { $in: user[fieldName] },
    }).select("_id");

    const updatedArray = [];
    foundedProducts.forEach((item) =>
      user[fieldName].includes(item._id) ? updatedArray.push(item._id) : null
    );

    user[fieldName] = updatedArray;

    await user.save({ validateBeforeSave: false });

    res.status(204).json({
      status: "success",
    });
  }
}

async function deleteAll(req, res, next, fieldName, Model, AppError) {
  const user = req.user;
  user[fieldName] = [];

  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
  });
}

async function getAll(req, res, next, fieldName, Model, AppError) {
  const user = await req.user.populate(fieldName);
  res.status(200).json({
    status: "success",
    data: user[fieldName],
  });
}
async function getOne(req, res, next, fieldName, Model, AppError) {
  const isInclude = req.user[fieldName].includes(req.params.productId);

  res.status(200).json({
    status: "success",
    data: isInclude,
  });
}

async function deleteMany(req, res, next, fieldName, Model, AppError) {
  const user = req.user;
  const { productIds } = req.body;
  if (!Array.isArray(productIds))
    return next(new AppError(400, "Please provide an Array of productIds"));
  console.log(productIds);
  user[fieldName].filter((item) => console.log(typeof item));

  const filteredFav = user[fieldName].filter(
    (item) => !productIds.includes(item.toString())
  );

  user[fieldName] = filteredFav;
  await user.save({ valiidateBeforeSave: false });
  res.status(204).json({
    status: "success",
  });
}

async function toggle(req, res, next, fieldName, Model, AppError) {
  const { productId } = req.params;

  const user = req.user;
  let state;
  console.log(user[fieldName]);
  const index = user[fieldName].findIndex((item) => item == productId);
  console.log(index);
  if (index == -1) {
    const product = await Model.findById(productId);
    if (!product)
      return next(
        new AppError(
          404,
          "There is no product with this id or product is deleted by seller"
        )
      );
    user[fieldName].push(productId);
    state = "added";
  } else {
    user[fieldName].splice(index, 1);
    state = "removed";
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: state,
  });
}

module.exports = {
  addOne,
  getAll,
  getOne,
  deleteAll,
  deleteOne,
  deleteMany,
  toggle,
};
