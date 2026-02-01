// Script to geocode existing listings without coordinates
// Run this once to populate latitude/longitude for existing listings

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { geocodeAddress } = require("./utils/geocode");

async function geocodeExistingListings() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // Find all listings without coordinates
    const listings = await Listing.find({
      $or: [
        { latitude: { $exists: false } },
        { longitude: { $exists: false } },
        { latitude: null },
        { longitude: null },
      ],
    });

    console.log(`Found ${listings.length} listings to geocode`);

    for (const listing of listings) {
      if (listing.location && listing.country) {
        console.log(`Geocoding: ${listing.location}, ${listing.country}`);
        const coordinates = await geocodeAddress(
          listing.location,
          listing.country,
        );

        if (coordinates) {
          listing.latitude = coordinates.latitude;
          listing.longitude = coordinates.longitude;
          await listing.save();
          console.log(`✓ Geocoded: ${listing.title}`);
        } else {
          console.log(`✗ Failed to geocode: ${listing.title}`);
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log("Geocoding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

geocodeExistingListings();
