const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Delete Review Route
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

//Reviews
router.post("/", validateReview, wrapAsync(reviewController.createReview));

module.exports = router;
