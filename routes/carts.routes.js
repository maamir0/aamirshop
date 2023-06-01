const express = require("express");
const cartController = require("../controllers/cartController");
const Authorization = require("../middleware/authorization.middelware");
const router = express.Router();

router.use(Authorization.protectRoute);
router.route("/").get(cartController.getCart);
router.route("/isInCart/:productId").get(cartController.isInCart);
router.route("/").delete(cartController.removeAll);
router.route("/:productId").post(cartController.addItem);
router.route("/deleteMany").delete(cartController.removeMany);
router.route("/:productId").delete(cartController.removeItem);
router.route("/toggle/:productId").post(cartController.toggleItem);

module.exports = router;
