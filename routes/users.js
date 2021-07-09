const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const authContoller = require('../controllers/auth');

router.route("/register")
    .get(authContoller.renderRegisterForm)
    .post(catchAsync(authContoller.registerUser))

router.route("/login")
    .get(authContoller.renderLoginForm)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
        authContoller.loginUser
        )

router.get('/logout', authContoller.logoutUser);

module.exports = router;