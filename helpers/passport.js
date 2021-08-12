const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users");

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
