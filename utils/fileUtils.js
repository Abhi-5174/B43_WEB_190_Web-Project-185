const fs = require("fs");
const path = require("path");

const deleteImage = (imagePath) => {
  if (!imagePath) return; // If no image, exit function

  const fullPath = path.join(__dirname, "..", "public", imagePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = deleteImage;
