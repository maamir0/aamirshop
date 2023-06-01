const express = require("express");
const shopController = require("../controllers/shopController");
const Authorization = require("../middleware/authorization.middelware");
const router = express.Router();

router
  .route("/")
  .post(
    Authorization.protectRoute,
    Authorization.restrictTo("user"),
    shopController.createShop
  );
router
  .route("/")
  .patch(
    Authorization.protectRoute,
    Authorization.restrictTo("seller"),
    shopController.updateShop
  );
router
  .route("/")
  .delete(
    Authorization.protectRoute,
    Authorization.restrictTo("seller"),
    shopController.deleteShop
  );
router
  .route("/my")
  .get(
    Authorization.protectRoute,
    Authorization.restrictTo("seller"),
    shopController.getMyShop
  );
router.route("/").get(shopController.getAllShops);

module.exports = router;
