const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverPic: { type: String },
    profilePic: { type: String },
    inventory: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
