const { catchAsync } = require("../utils/catchAsync");
const Review = require("../models/review.model");
const ApiFeatures = require("../utils/ApiFeatures");

const getAllReviews = catchAsync(async (req, res, next) => {
  const results = await new ApiFeatures(req.query, Review.find())
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
const getOneReview = catchAsync(async (req, res, next) => {
  const result = await new ApiFeatures(
    req.query,
    Review.find({ productId: req.params.id })
  )
    .limitFields()
    .dbQuery.exec();

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, review, rating } = req.body;
  const newReview = await new Review({
    userId,
    userEmail: req.user.email,
    userProfilePic: req.user.profilePic,
    productId,
    review,
    rating,
  }).save();

  res.status(201).json({
    status: "success",
    data: newReview,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;
  const updateReview = await Review.findByIdAndUpdate(
    req.params.id,
    { review, rating, edited: true },
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  res.status(201).json({
    status: "success",
    data: updateReview,
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});
const userReview = catchAsync(async (req, res, next) => {
  const myReviews = await Review.find({
    $and: [{ productId: req.query.productId }, { userId: req.query.userId }],
  });
  res.status(202).json({
    status: "success",
    data: myReviews,
  });
});

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getOneReview,
  userReview,
};
