const express = require("express");
const { validateReview } = require("../utils/validateData");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor } = require("../utils/middlewares");
const reviewController = require("../controllers/reviews");

router = express.Router({ mergeParams: true });

router.post(
    "/reviews",
    isLoggedIn,
    validateReview,
    catchAsync(reviewController.postReview)
);

router.delete(
    "/reviews/:reviewID",
    isLoggedIn,
    catchAsync(isReviewAuthor),
    catchAsync(reviewController.deleteReview)
);

module.exports = router;
