require("dotenv").config();
const Product = require("../models/product.model");
const Catogory = require("../models/catogory.model");
const mongoose = require("mongoose");
const { mockProducts } = require("../mocks/products.mocks.data");
const { mockCatogories } = require("../mocks/catogories.mocks.data");
mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

if (process.argv.includes("--del")) {
  process.argv.forEach((arg) => {
    switch (arg) {
      case "--prod":
        deleteAllFrom(Product);
        break;
      case "--cat":
        deleteAllFrom(Catogory);
        break;
      default:
        break;
    }
  });
}
if (process.argv.includes("--ins")) {
  process.argv.forEach((arg) => {
    switch (arg) {
      case "--prod":
        insertTo(Product, mockProducts);
        break;
      case "--cat":
        insertTo(Catogory, mockCatogories);
        break;
      default:
        break;
    }
  });
}

function insertTo(Model, mockData) {
  Model.insertMany(mockData)
    .then((result) => {
      console.log("Inserted");
      process.exit(0);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
function deleteAllFrom(Model) {
  Model.deleteMany({})
    .then((result) => {
      console.log("deleted");
      process.exit(0);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
