const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const authController = require("../controllers/auth");

router
  .route("/register")
  .get(authController.renderRegisterForm)
  .post(catchAsync(authController.registerUser));

router
  .route("/login")
  .get(authController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      successFlash: "Welcome Back!",
    }),
    authController.loginUser
  );

router.get("/logout", authController.logoutUser);

router
  .route("/forget")
  .get(authController.forget)
  .post(authController.forgetPost);

router
  .route("/otpForm")
  .get(authController.renderOtpForm)
  .post(authController.otpFormPost);

router
  .route("/newPass/:id")
  .get(authController.renderChangePassForm)
  .post(authController.newPassPost);

module.exports = router;
