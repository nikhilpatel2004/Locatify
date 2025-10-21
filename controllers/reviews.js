const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Cannot find listing to add a review.");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  // Save the new review first
  await newReview.save();

  // Then, push its ID into the listing's reviews array without re-saving the whole listing
  await Listing.findByIdAndUpdate(req.params.id, {
    $push: { reviews: newReview._id },
  });

  req.flash("success", "Review Added!");
  res.redirect(`/listings/${listing._id}`);
};

  module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");

    res.redirect(`/listings/${id}`);
  };