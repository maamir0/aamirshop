const express = require("express");
const authController = require("../controllers/authController");
const { otpVerifcation } = require("../middleware/otpVerification.middleware");
const { Multer } = require("../config/multer.config");
const router = express.Router();

router
  .route("/signUpWithEmail")
  .post(
    Multer.diskStorage("/users/profilePics").single("profilePic"),
    authController.signUpWithEmail
  );
router.route("/loginWithEmail").post(authController.loginWithEmail);
router.route("/verifyUser").patch(otpVerifcation, authController.verifyUser);

router.route("/resendOTP").patch(authController.resendOTP);
router.route("/forgotPassword").post(authController.forgotPassword);
router
  .route("/resetPassword")
  .patch(otpVerifcation, authController.resetPassword);
router.route("/verifyOTP").post(otpVerifcation, authController.verifyOTP);
router.route("/changePassword").patch(authController.changePassword);

module.exports = router;
