const express = require("express");
const { upload } = require("../config/multer.config");

const productsController = require("../controllers/productsController");
const Authorization = require("../middleware/authorization.middelware");

const router = express.Router();

router.route("/").get(productsController.getAllProducts);
router.route("/highRated").get(productsController.highRatedProducts);
router.route("/newlyArived").get(productsController.newlyArrivedProducts);
router.route("/featured").get(productsController.featuredProducts);
router.route("/hotDeals").get(productsController.hotDealProducts);
router.route("/random15").get(productsController.randomProducts);
router.route("/:id").get(productsController.getOneProduct);
// router.use(Authorization.protectRoute, Authorization.restrictTo("seller"));
router
  .route("/")
  .post(upload.array("images", 10), productsController.createProduct);
router.route("/:id").delete(productsController.deleteProduct);
router.route("/:id").patch(productsController.updateProduct);

module.exports = router;
