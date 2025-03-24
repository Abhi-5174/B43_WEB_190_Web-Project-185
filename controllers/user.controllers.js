const path = require("path");

const User = require("../models/User");
const deleteImage = require("../utils/fileUtils");
const Pincode = require("../models/Pincode");

module.exports.uploadPhoto = async (req, res, next) => {
  if (!req.user)
    return res.redirect("/users/login", {
      showPopup: true,
      message: "Please login first!",
      bgcolor: "red",
      color: "white",
    });

  try {
    const pinocdes = await Pincode.find();

    if (!req.file) {
      return res.render("pages/error", {
        errorMessage: "No file uploaded!",
        user: req.user,
        previous_url: "/users/profile",
        pinocdes,
      });
    }

    req.user.photo = req.file.filename;
    await req.user.save();

    res.redirect("/users/profile");
  } catch (error) {
    req.previous_url = "/users/profile";
    next(error);
  }
};

module.exports.deleteProfileImage = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.photo) return res.redirect("/users/profile");

    if (user.photo) {
      const imagePath = path.join(__dirname, "..", "public", user.photo);

      deleteImage(imagePath);
    }

    // Remove image from DB
    user.photo = null;
    await user.save();

    res.redirect("/users/profile");
  } catch (err) {
    req.previous_url = "/users/profile";
    next(err);
  }
};

module.exports.getProfilePage = (req, res, next) => {
  if (!req.user)
    return res.status(500).render("pages/error", {
      errorMessage: "You need to login first!",
    });

  res.render("pages/profile", { user: req.user });
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, street, city, state, zip } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        address: { street, city, state, zip },
      },
      { new: true }
    );

    res.redirect("/users/profile"); // Redirect back to profile page
  } catch (error) {
    req.previous_url = "/users/update-profile";
    next(error);
  }
};

module.exports.getOfferPage = async (req, res, next) => {
  try {
    const pincodes = await Pincode.find();

    res.render("pages/offer", { user: req.user || null, pincodes });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = (req, res, next) => {
  res.clearCookie("auth_token");
  res.redirect("/");
};
