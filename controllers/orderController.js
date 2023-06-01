const { catchAsync } = require("../utils/catchAsync");
const Order = require("../models/order.model");
const stripe = require("stripe")(
  "sk_test_51NCDBnFLDQjuRWyyAX8r0gTPwhDfTaflddqfpeyIEkOCuPdQABENE254snHMOVp3BObbHrme2MFmlJyV01rYZl5O00323z8xqB"
);

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("products");
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const customer = req.user._id;
  const { products, totalPrice, shippingAddress } = req.body;
  const newOrder = new Order({
    products,
    shippingAddress,
    customer,
    totalPrice,
  });
  await newOrder.save();
  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});

const getOneOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: "fail",
      message: "Order not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: order,
  });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find({ customer: req.user._id }).populate(
    "products"
  );
  if (!order) {
    return res.status(404).json({
      status: "fail",
      message: "Order not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  console.log("got request");
  if (req.user.role == "admin") {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  } else {
    console.log("in");
    const order = await Order.findByIdAndUpdate(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    if (customer != req.user._id) {
      return res.status(404).json({
        status: "fail",
        message: "You are not allowed to perform this action",
      });
    }

    order.status = status;
    order.save({ validateBeforeSave: false });
    console.log("res");
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  }
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: "fail",
      message: "Order not found",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const createPaymentIntent = catchAsync(async (req, res, next) => {
  console.log("gotttttt");
  const { amount, products, shippingAddress } = req.body;
  const address = req.user.shippingAddresses.find(
    (e) => e._id == shippingAddress
  );
  console.log(products);

  const data = {
    totalPrice: amount,
    products: products,
    shippingAddress: address,
    customer: req.user._id,
  };

  console.log(data);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      data: JSON.stringify(data),
    },
  });
  res.status(202).json({
    status: "success",
    data: paymentIntent,
  });
});

module.exports = {
  getAllOrders,
  createOrder,
  getOneOrder,
  updateOrderStatus,
  deleteOrder,
  createPaymentIntent,
  getUserOrders,
};
