const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    catogory: { type: Schema.Types.ObjectId, ref: "Catogory" },
    subCatogory: { type: Schema.Types.ObjectId, ref: "Catogory" },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      select: false,
    },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inStock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating should between 1 and 5 "],
      max: [5, "Rating should between 1 and 5 "],
      default: 2.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      deafult: false,
    },
    hotDeal: {
      type: Boolean,
      deafult: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
