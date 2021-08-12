const expressError = require("../utils/expressError");

module.exports.pageNotFound = (req, res, next) => {
  next(new expressError("Page Not Found", 404));
};

module.exports.allErrors = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  if (err.message.includes("Cast to ObjectId failed")) {
    req.flash("error", "Invalid Search ID!");
    return res.redirect("/campgrounds");
  }

  if (err.message === "Unexpected field") {
    req.flash("error", "Sorry Cannot Upload More Than 3 Images");
    return res.redirect(req.originalUrl);
  }

  if (err.message.includes("Invalid regular expression")) {
    req.flash("error", "Invalid Search");
    return res.redirect("/campgrounds");
  }
  return res.status(err.statusCode).render("error", { err });
};
