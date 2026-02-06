const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${listing._id}`);
  }
  next();
};

//Validation Middleware for listings (handles multipart form data)
module.exports.validateListing = (req, res, next) => {
  console.log("=== VALIDATION DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  
  // Manual validation for required fields
  const { title, description, price, location, country } = req.body;
  
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!price || isNaN(price) || Number(price) < 0) {
    errors.push('Valid price is required');
  }
  
  if (!location || location.trim() === '') {
    errors.push('Location is required');
  }
  
  if (!country || country.trim() === '') {
    errors.push('Country is required');
  }
  
  if (errors.length > 0) {
    console.log("Validation errors:", errors);
    throw new ExpressError(errors.join(', '), 400);
  }
  
  console.log("Validation passed");
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      error.details.map((el) => el.message).join(","),
      400,
    );
  } else {
    next();
  }
};
