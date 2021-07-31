const User = require("../models/users");
const { sendMail, otpgenerator } = require("../utils/sendMail");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  req.flash("success", "Welcome Back!");
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged Out");
  res.redirect("/campgrounds");
};

module.exports.forget = (req, res) => {
  res.render("users/forget");
};

module.exports.renderOtpForm = (req, res) => {
  res.render("users/otpForm");
};

module.exports.renderChangePassForm = (req, res) => {
  res.render("users/newPass.ejs", { userId: req.params.id });
};

module.exports.forgetPost = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No User Linked With That Email Address");
    return res.redirect("/forget");
  }
  const otp = otpgenerator();
  user.otp = otp;
  user.validTill = Date.now() + 5 * 60 * 1000;
  await user.save();
  const mail = sendMail(req.body.email, otp);
  if (!mail) {
    req.flash("error", "Something Went Wrong Maybe Try Again Later");
    return res.redirect("/forget");
  }
  res.redirect("/otpForm");
};

module.exports.otpFormPost = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({
    $and: [{ otp: otp }, { validTill: { $gt: Date.now() } }],
  });

  if (!user) {
    req.flash("error", "Your otp is wrong or has been expired.");
    return res.redirect("/otpForm");
  }

  user.otp = null;
  user.validTill = null;
  await user.save();
  res.redirect(`/newPass/${user._id}`);
};

module.exports.newPassPost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "No User Found");
      return res.redirect("/campgrounds");
    }
    if (req.body["new-pass"] !== req.body["confirm-pass"]) {
      req.flash(
        "error",
        "Passwords provided were not equal please check again"
      );
      return res.redirect(`/newPass/${user._id}`);
    }
    await user.setPassword(req.body["new-pass"]);
    await user.save();
    req.login(user, err => {
      if (err) return next(err);
      req.flash("success", "Password Changed Successfully!");
      return res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", "Invalid User ID");
    return res.redirect("/campgrounds");
  }
};
