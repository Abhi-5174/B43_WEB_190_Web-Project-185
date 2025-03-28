const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../config/multer");

const deleteImage = (imagePath) => {
  if (!imagePath) return;

  if (process.env.NODE_ENV === "production" && cloudinary) {
    const publicId = imagePath.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Error deleting Cloudinary image:", error);
      }
    });
  } else {
    const fullPath = path.join(__dirname, "..", "public", imagePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

module.exports = deleteImage;
