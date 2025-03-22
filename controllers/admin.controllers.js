const fs = require("fs");

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Pincode = require("../models/Pincode");

module.exports.getAdminPage = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPincodes = await Pincode.countDocuments();

    res.render("pages/admin", {
      user: req.user,
      details: { totalUsers, totalPincodes, totalProducts, totalOrders },
    });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getReportsPage = async (req, res) => {
  res.render("pages/admin/reports");
};

module.exports.getSettingsPage = async (req, res) => {
  res.render("pages/admin/settings");
};
