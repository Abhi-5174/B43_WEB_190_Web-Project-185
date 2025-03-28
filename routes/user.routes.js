const express = require("express");

const { upload, cloudinary } = require("../config/multer");
const userController = require("../controllers/user.controllers");
const authController = require("../controllers/auth.controllers");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignupPage);

router.post("/signup", authController.postSignup);

router.get("/forgot-password", authController.getForgotPasswordPage);

router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset-password/:token", authController.getResetPasswordPage);

router.post("/reset-password/:token", authController.postResetPassword);

router.post(
  "/upload",
  isAuthenticated,
  upload.single("profile_image"),
  userController.uploadPhoto
);

router.post("/delete-photo", userController.deleteProfileImage);

router.get("/profile", isAuthenticated, userController.getProfilePage);

router.post("/update-profile", isAuthenticated, userController.updateProfile);

router.get("/offer", isAuthenticated, userController.getOfferPage);

router.get("/logout", userController.logout);

module.exports = router;
