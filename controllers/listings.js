const Listing = require("../models/listing");
const { geocodeAddress } = require("../utils/geocode");

// ================= INDEX =================
module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving listings");
  }
};

// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ================= SHOW =================
module.exports.showListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("reviews")
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving listing");
  }
};

// ================= CREATE =================
module.exports.createListing = async (req, res) => {
  try {
    console.log("=== CREATE LISTING DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.user:", req.user);
    
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;

    // ---------- IMAGE ----------
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // ---------- GEOCODING ----------
    if (newListing.location) {
      const coordinates = await geocodeAddress(
        newListing.location,
        newListing.country || "",
      );

      if (coordinates) {
        newListing.latitude = coordinates.latitude;
        newListing.longitude = coordinates.longitude;
      }
    }

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error("=== CREATE LISTING ERROR ===");
    console.error(error);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings");
  }
};

// ================= EDIT FORM =================
module.exports.renderEditForm = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    let originalImage = listing.image?.url;
    if (originalImage) {
      originalImage = originalImage.replace("/upload", "/upload/w_250/");
    }

    res.render("listings/edit.ejs", {
      listing,
      originalImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving listing for edit");
  }
};

// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // ---------- IMAGE ----------
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // ---------- GEOCODING (re-run if location exists) ----------
    if (listing.location) {
      const coordinates = await geocodeAddress(
        listing.location,
        listing.country || "",
      );

      if (coordinates) {
        listing.latitude = coordinates.latitude;
        listing.longitude = coordinates.longitude;
      }
    }

    await listing.save();

    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update listing");
    res.redirect("/listings");
  }
};

// ================= DELETE =================
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting listing");
  }
};
