const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        if (req.session.returnTo.includes("reviews")) {
            req.session.returnTo = `/campgrounds/${req.params.id}`;
        }
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Campground Not Found");
        return res.redirect("/campgrounds");
    }
    const campgroundAuthorId = campground.author;
    if (!(`${req.user._id}` == `${campgroundAuthorId}`)) {
        req.flash("error", "You Are Not Allowed To do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
