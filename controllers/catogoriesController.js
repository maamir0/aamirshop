const { catchAsync } = require("../utils/catchAsync");
const Catogory = require("../models/catogory.model");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");

const getAllCatogories = catchAsync(async (req, res, next) => {
  const results = await new ApiFeatures(req.query, Catogory.find({}))
    .search()
    .filter()
    .limitFields()
    .sort()
    .pagination()
    .dbQuery.exec();

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});
const getOneCatogory = catchAsync(async (req, res, next) => {
  const result = await new ApiFeatures(
    req.query,
    Catogory.findById(req.params.id)
  )
    .limitFields()
    .dbQuery.exec();

  res.status(200).json({
    status: "success",
    data: result,
  });
});
const getPromotionalCatogories = catchAsync(async (req, res, next) => {
  const result = await new ApiFeatures(
    req.query,
    Catogory.find({ promotional: true })
  )
    .limitFields()
    .dbQuery.exec();

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const createCatogory = catchAsync(async (req, res, next) => {
  const image = req.file?.path.split("public")[1];
  const { title, subTitle, promotional } = req.body;
  const newCatogory = await new Catogory({
    title,
    subTitle,
    promotional,
    image,
  }).save();

  res.status(201).json({
    status: "success",
    data: newCatogory,
  });
});

const updateCatogory = catchAsync(async (req, res, next) => {
  const image = req.file?.path.split("public")[1];
  const { title, subTitle, promotional } = req.body;
  const updatedCatogory = await Catogory.findByIdAndUpdate(
    req.params.id,
    { title, subTitle, promotional, image },
    { new: true, runValidators: true }
  ).exec();

  res.status(201).json({
    status: "success",
    data: updatedCatogory,
  });
});

const deleteCatogory = catchAsync(async (req, res, next) => {
  await Catogory.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});

const addToPromotional = catchAsync(async (req, res, next) => {
  const catogories = await Catogory.find({ promotional: true });
  if (catogories.length > 10) {
    return next(
      new AppError(
        404,
        "you cannot add more catogories to promotional please remove some first"
      )
    );
  }
  const updatedCatogory = await Catogory.findByIdAndUpdate(
    req.params.id,
    { promotional: true },
    { new: true, runValidators: true }
  ).exec();

  res.status(201).json({
    status: "success",
    data: updatedCatogory,
  });
});
const removeFromPromotional = catchAsync(async (req, res, next) => {
  const updatedCatogory = await Catogory.findByIdAndUpdate(
    req.params.id,
    { promotional: false },
    { new: true, runValidators: true }
  ).exec();

  res.status(201).json({
    status: "success",
    data: updatedCatogory,
  });
});

module.exports = {
  getAllCatogories,
  getPromotionalCatogories,
  createCatogory,
  deleteCatogory,
  updateCatogory,
  getOneCatogory,
  addToPromotional,
  removeFromPromotional,
};
