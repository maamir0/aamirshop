const express = require("express");
const { upload, Multer } = require("../config/multer.config");

const catogoriesController = require("../controllers/catogoriesController");
const router = express.Router();

router.route("/").get(catogoriesController.getAllCatogories);
router
  .route("/")
  .post(
    Multer.diskStorage("/catogories/img").single("image"),
    catogoriesController.createCatogory
  );
router
  .route("/promotionals")
  .get(catogoriesController.getPromotionalCatogories);
router.route("/:id").get(catogoriesController.getOneCatogory);
router.route("/:id").delete(catogoriesController.deleteCatogory);
router
  .route("/:id")
  .patch(
    Multer.diskStorage("/catogories/img").single("image"),
    catogoriesController.updateCatogory
  );
router.route("/:id").patch(catogoriesController.addToPromotional);
router.route("/:id").patch(catogoriesController.removeFromPromotional);

module.exports = router;
