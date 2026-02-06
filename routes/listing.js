const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");

const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err);
    req.flash("error", `File upload error: ${err.message}`);
    return res.redirect("/listings/new");
  } else if (err) {
    console.error("Upload Error:", err);
    req.flash("error", "Error uploading file");
    return res.redirect("/listings/new");
  }
  next();
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    (req, res, next) => {
      console.log("=== BEFORE MULTER ===");
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      next();
    },
    upload.single("image"),
    handleMulterError,
    (req, res, next) => {
      console.log("=== AFTER MULTER ===");
      console.log("Body:", req.body);
      console.log("File:", req.file);
      next();
    },
    validateListing,
    wrapAsync(listingController.createListing),
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//INDEX ROUTE TO DISPLAY ALL LISTINGS

//Show Route

//Create Route

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

//Update Route

//Delete Route

module.exports = router;
