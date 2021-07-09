const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");

module.exports.postReview = async (req, res) => {
  const review = new Review(req.body.review);
  review.author = req.user._id;
  const campground = await Campground.findById(req.params.id).populate(
    "reviews"
  );
  campground.reviews.push(review);
  let avg = 0;
  for (let review of campground.reviews) {
    avg = avg + review.rating;
  }
  avg = avg / campground.reviews.length;
  campground.avg_rating = avg.toFixed(1);
  await campground.save();
  await review.save();
  req.flash("success", "Review Posted Successfully!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      $pull: { reviews: reviewID },
    },
    { new: true }
  ).populate("reviews");
  const review = await Review.findByIdAndDelete(reviewID);
  let avg = 0;
  if (campground.reviews.length > 0) {
    for (let review of campground.reviews) {
      avg = avg + review.rating;
    }
    avg = avg / campground.reviews.length;
  }
  campground.avg_rating = avg.toFixed(1);
  await campground.save();
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/campgrounds/${id}`);
};
