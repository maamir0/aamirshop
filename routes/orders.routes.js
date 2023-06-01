const express = require("express");
const { upload } = require("../config/multer.config");

const ordersController = require("../controllers/orderController");
const Authorization = require("../middleware/authorization.middelware");

const router = express.Router();

router.use(Authorization.protectRoute);
router.route("/updateStatus/:id").patch(ordersController.updateOrderStatus);
router.route("/").get(ordersController.getAllOrders);
router.route("/createPaymentIntent").get(ordersController.createPaymentIntent);
router.route("/user").get(ordersController.getUserOrders);
router.route("/").post(ordersController.createOrder);
router.route("/:id").delete(ordersController.deleteOrder);

module.exports = router;
