const express = require("express");
const favoritesController = require("../controllers/favoritesController");
const Authorization = require("../middleware/authorization.middelware");
const router = express.Router();

router.use(Authorization.protectRoute);
router.route("/isFavorite/:productId").get(favoritesController.isFavorite);
router.route("/").get(favoritesController.getFavorites);
router.route("/").delete(favoritesController.removeAll);
router.route("/:productId").post(favoritesController.addItem);
router.route("/deleteMany").delete(favoritesController.removeMany);
router.route("/:productId").delete(favoritesController.removeItem);
router.route("/toggle/:productId").post(favoritesController.toggleItem);

module.exports = router;
