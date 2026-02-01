const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.deleteReview = async (req, res) => {
  const { id: listingId, reviewId } = req.params;
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully Deleted a review!");
  res.redirect(`/listings/${listingId}`);
};

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully created a review!");
  res.redirect(`/listings/${listing._id}`);
};
