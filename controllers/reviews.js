const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');

module.exports.postReview = async (req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Review Posted Successfully!")
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Deleted Successfully")
    res.redirect(`/campgrounds/${id}`);
}