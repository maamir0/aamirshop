const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    shippingAddress: {
      title: { type: String, required: true },
      country: { type: String, required: true },
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
      phone: { type: Number, required: true },
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware
// orderSchema.pre("save", async function (next) {
//   const product = await mongoose.model("Product").findById(this.product);

//   if (!product) {
//     return next(new Error("Product not found"));
//   }

//   product.sold += this.quantity;
//   product.inStock -= this.quantity;

//   await product.save();
//   next();
// });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
