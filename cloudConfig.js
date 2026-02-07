const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

console.log("Cloudinary Config Check:");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME ? "Set" : "MISSING");
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY ? "Set" : "MISSING");
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "Set" : "MISSING");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nestora-dev',
    allowedFormats: ["png", "jpg", "jpeg"],
    public_id: (req, file) => {
      // Generate unique ID using timestamp + random string
      return 'listing-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    },
  },
});

module.exports = { cloudinary, storage };