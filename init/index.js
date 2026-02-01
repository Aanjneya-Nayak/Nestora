const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/online-booking-system");
  console.log("Connected to MongoDB");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "697b5dd90469b9df1e79c5db",
      // Replace with a valid User ObjectId from your database
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB();
