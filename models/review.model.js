const mongoose = require("mongoose");
const Product = require("./product.model");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    userEmail: { type: String, required: true },
    userProfilePic: { type: String },
    review: { type: String, required: true },
    edited: { type: Boolean, default: false },
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre("save", async function (next) {
  const product = await Product.findById(this.productId).exec();
  if (!product) return next(new AppError(404, "product does not exists"));
  product.rating = (product.rating + this.rating) / 2;
  product.ratingsQuantity += 1;
  await product.save();
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
