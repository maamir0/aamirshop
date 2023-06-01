const path = require("path");
const { catchAsync } = require("../utils/catchAsync");
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const ApiFeatures = require("../utils/ApiFeatures");
const AuthServices = require("../services/auth.services");
const AppError = require("../utils/appError");
const { User } = require("../models/user.model");
const { filterUndefinedObj } = require("../utils/fiterUndefinedObj");
const getAllProducts = catchAsync(async (req, res, next) => {
  const results = await new ApiFeatures(
    req.query,
    Product.find({ isPublic: true }).select("+sellerId")
  )
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
const getOneProduct = catchAsync(async (req, res, next) => {
  const bearerToken = req.header("Authorization");
  let user;
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    const payload = AuthServices.verifyJwt(token);
    user = await User.findById(payload.uid).select(
      "+isPasswordChanged +passwordChangedAt +role"
    );
    if (user?.isPasswordChanged) {
      if (
        new Date(user.passwordChangedAt).getTime() / 1000 >
        Number.parseInt(payload.iat)
      ) {
        return next(
          new AppError(401, "You have changed your password please login again")
        );
      }
    }
  }

  let product;
  let result = await new ApiFeatures(
    req.query,
    Product.findById(req.params.id).select("+sellerId")
  )
    .limitFields()
    .dbQuery.populate("catogory subCatogory")
    .exec();
  console.log(result, ":Result");

  if (result?.isPublic == true) {
    product = result;
  } else {
    if (result?.sellerId === user?._id) {
      product = result;
    } else {
      product = null;
    }
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  // const shop = await Shop.findOne({ sellerId: req.user._id });
  const {
    name,
    description,
    price,
    inStock,
    catogory,
    subCatogory,
    isPublic,
    featured,
    hotDeal,
  } = req.body;

  const images = [];
  req.files.forEach((file) => {
    images.push(file.path.split("public")[1]);
  });
  const newProduct = new Product({
    name,
    description,
    price,
    inStock,
    images,
    catogory,
    subCatogory,
    // shopId: shop._id,
    // sellerId: req.user._id,
    coverImage: images[0],
    isPublic,
    featured,
    hotDeal,
  });
  await newProduct.save();
  // shop.inventory.push(newProduct);
  // shop.save();

  res.status(201).json({
    status: "success",
    data: newProduct,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    catogory,
    subCatogory,
    isPublic,
    inStock,
    images,
    featured,
    hotDeal,
  } = req.body;
  const updatedProduct = await Product.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { sellerId: req.user._id }] },
    filterUndefinedObj({
      name,
      description,
      price,
      catogory,
      subCatogory,
      isPublic,
      inStock,
      images,
      featured,
      hotDeal,
    }),
    { new: true, runValidators: true }
  ).exec();

  res.status(201).json({
    status: "success",
    data: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findOneAndDelete({
    $and: [{ _id: req.params.id }, { sellerId: req.user._id }],
  }).exec();
  res.status(204).json({
    status: "success",
  });
});

const newlyArrivedProducts = catchAsync(async (req, res, next) => {
  const results = await Product.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 15,
    },
  ]);

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});
const highRatedProducts = catchAsync(async (req, res, next) => {
  const results = await Product.aggregate([
    {
      $sort: { rating: -1, ratingsQuantity: -1 },
    },
    {
      $limit: 15,
    },
  ]);

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});
const randomProducts = catchAsync(async (req, res, next) => {
  const results = await Product.aggregate([{ $sample: { size: 15 } }]);

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});
const catogorySpecific = catchAsync(async (req, res, next) => {
  const results = await Product.aggregate([{ $sample: { size: 15 } }]);

  res.status(200).json({
    status: "success",
    results: results.length,
    data: results,
  });
});

const featuredProducts = catchAsync(async (req, res, next) => {
  const results = await new ApiFeatures(
    req.query,
    Product.find({ featured: true })
  )
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
const hotDealProducts = catchAsync(async (req, res, next) => {
  const results = await new ApiFeatures(
    req.query,
    Product.find({ hotDeal: true })
  )
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

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getOneProduct,
  newlyArrivedProducts,
  featuredProducts,
  hotDealProducts,
  highRatedProducts,
  randomProducts,
};
