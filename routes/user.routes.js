const express = require("express");
const userController = require("../controllers/userController");
const Authorization = require("../middleware/authorization.middelware");
const router = express.Router();

router.use(Authorization.protectRoute);
router.route("/shippingAddress").post(userController.addToShippingAddress);
router.route("/shippingAddress").get(userController.getShippingAddress);
router.route("/shippingAddress/:id").delete(userController.deleteAddress);

module.exports = router;
