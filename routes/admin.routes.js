const express = require("express");
const fs = require("fs");

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Pincode = require("../models/Pincode");
const upload = require("../config/multer");

const router = express.Router();

router.get("/:pass", async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.render("pages/admin", {
      user: req.user,
      details: { totalUsers, totalProducts, totalOrders },
    });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

// Admin User page
router.get("/users/:pass", async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }
  try {
    const users = await User.find().select("-password");

    res.render("pages/admin/users", { users });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/edit-user/:id/:pass", async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/users/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const user = await User.findById(id);

    user.role = user.role == "user" ? "admin" : "user";

    await user.save();

    res.redirect("/admin/users/1111");
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/delete-user/:id/:pass", async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/users/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const user = await User.findByIdAndDelete(id);

    res.redirect("/admin/users/1111");
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

// Admin Products page
router.get("/products/:pass", async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }
  try {
    const products = await Product.find();

    res.render("pages/admin/products", { products });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/add-product/:pass", async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  res.render("pages/admin/addproduct");
});

router.post(
  "/add-product/:pass",
  upload.single("image"),
  async (req, res, next) => {
    const { pass } = req.params;
    if (!pass || pass !== "1111") {
      const err = new Error("Access denied!");
      return next(err);
    }

    try {
      const { name, manufacturer, quantity, price, mrp, discount } = req.body;
      const imagePath = req.file ? "/uploads/" + req.file.filename : "";

      if (mrp < price) {
        return res.redirect(
          "/admin/add-product/1111?error=" +
            encodeURIComponent("MRP should be greater than price!")
        );
      }

      const newMedicine = new Product({
        name,
        manufacturer,
        quantity,
        price,
        mrp,
        discount,
        image: imagePath,
      });

      await newMedicine.save();

      res.redirect("/admin/products/1111");
    } catch (error) {
      res.redirect(
        "/admin/add-product/1111?error=" + encodeURIComponent(error.message)
      );
    }
  }
);

router.get("/edit-product/:id/:pass", async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/products/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  const product = await Product.findById(id);

  res.render("pages/admin/editproduct", { product });
});

router.post(
  "/edit-product/:id/:pass",
  upload.single("image"),
  async (req, res, next) => {
    const { id, pass } = req.params;
    if (!pass || pass !== "1111" || !id) {
      return res.redirect(
        "/admin/products/1111?error=" +
          encodeURIComponent("User ID and Auth password is required")
      );
    }
    try {
      const { name, manufacturer, quantity, price, mrp, discount } = req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.redirect(
          "/admin/products/1111?error=" +
            encodeURIComponent("Product not found")
        );
      }

      let imagePath = product.image;

      if (req.file) {
        imagePath = "/uploads/" + req.file.filename;

        // Delete old image file if it exists
        if (product.image && fs.existsSync("public" + product.image)) {
          fs.unlinkSync("public" + product.image);
        }
      }

      // Update Product
      product.name = name;
      product.manufacturer = manufacturer;
      product.quantity = quantity;
      product.price = price;
      product.mrp = mrp;
      product.discount = discount;
      product.image = imagePath;

      await product.save();

      res.redirect("/admin/products/1111");
    } catch (error) {
      return res.redirect(
        "/admin/products/1111?error=" + encodeURIComponent(error.message)
      );
    }
  }
);

router.get("/delete-product/:id/:pass", async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/products/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const product = await Product.findByIdAndDelete(id);

    res.redirect("/admin/products/1111");
  } catch (error) {
    return res.redirect(
      "/admin/products/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

// Admin Pincode
router.get("/pincodes/:pass", async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const pincodes = await Pincode.find();

    res.render("pages/admin/pincodes", { pincodes });
  } catch (error) {
    res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/add-pincode/:pass", async (req, res) => {
  res.render("pages/admin/addpincode");
});

router.post("/add-pincode/:pass", async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/pincodes/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const { pincode } = req.body;

    await Pincode.create({ pincode });

    const pincodes = await Pincode.find();

    res.render("pages/admin/pincodes", { pincodes });
  } catch (error) {
    return res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/delete-pincode/:id/:pass", async (req, res) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/pincodes/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    await Pincode.findByIdAndDelete(id);

    res.redirect("/admin/pincodes/1111");
  } catch (error) {
    return res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/orders/:pass", async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const orders = await Order.find();

    res.render("pages/admin/orders", { orders });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

router.get("/delete-order/:id/:pass", async (req, res) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    await Order.findByIdAndDelete(id);

    res.redirect("/admin/orders/1111");
  } catch (error) {
    return res.redirect(
      "/admin/orders/1111?error=" + encodeURIComponent(error.message)
    );
  }
});

// Admin Reports
router.get("/reports/:pass", async (req, res) => {
  res.render("pages/admin/reports");
});

// Admin Setting
router.get("/settings/:pass", async (req, res) => {
  res.render("pages/admin/settings");
});

module.exports = router;
