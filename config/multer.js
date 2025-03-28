const multer = require("multer");
const path = require("path");

let upload;
let cloudinary = null;

if (process.env.NODE_ENV === "production") {
  // 🔹 Use Cloudinary in production
  cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "pharmEasy", // Cloudinary folder
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  upload = multer({ storage });
} else {
  // 🔹 Use local storage in development
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
}

module.exports = { upload, cloudinary };
