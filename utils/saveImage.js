const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function saveGooglePhoto(photoUrl, userId) {
  const uploadDir = path.join(__dirname, "../public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const extension = path.extname(new URL(photoUrl).pathname) || ".jpg"; // Default to .jpg if no extension found

  const filename = `${userId}${extension}`;
  const filePath = path.join(uploadDir, filename);

  try {
    const response = await axios({
      method: "GET",
      url: photoUrl,
      responseType: "arraybuffer",
    });

    fs.writeFileSync(filePath, response.data);

    return filename;
  } catch (err) {
    console.error("Failed to save Google photo:", err);
    throw err;
  }
}

module.exports = saveGooglePhoto;
