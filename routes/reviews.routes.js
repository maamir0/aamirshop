const express = require("express");
const reviewController = require("../controllers/reviewController");
const Authorization = require("../middleware/authorization.middelware");

const router = express.Router();

router.route("/").get(reviewController.getAllReviews);
router.route("/userReview").get(reviewController.userReview);
router
  .route("/")
  .post(Authorization.protectRoute, reviewController.createReview);
router.route("/:id").get(reviewController.getOneReview);
router
  .route("/:id")
  .delete(Authorization.protectRoute, reviewController.deleteReview);
router
  .route("/:id")
  .patch(Authorization.protectRoute, reviewController.updateReview);

module.exports = router;
