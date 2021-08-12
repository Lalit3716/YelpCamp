const flash = require("connect-flash");

module.exports = app => {
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
  });
};
