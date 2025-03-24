const express = require("express");

const Category = require("../models/Category");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const router = express.Router();

router.get("/view_cart", (req, res) => {
  res.render("pages/view_cart", { user: req.user || null });
});

router.get("/hcareProduct", async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.render("pages/hcareProduct", { user: req.user || null, categories });
  } catch (error) {
    req.previous_url = "/";
    next(error);
  }
});

router.get("/hcareproduct/filter", async (req, res, next) => {
  const { categoryId } = req.query;
  try {
    const category = await Category.findById(categoryId);

    const filteredProducts = await Product.find({ category: categoryId });

    res.render("pages/showproducts", {
      products: filteredProducts,
      user: req.user || null,
      category,
    });
  } catch (error) {
    req.previous_url = "/others/hcareproduct";
    next(error);
  }
});

router.get("/hcareproduct/product/:productId", async (req, res, next) => {
  const { productId } = req.params;
  let cartLength = 0;
  let is_added = false;

  try {
    const product = await Product.findById(productId);

    if (req.user) {
      const cart = await Cart.findOne({ userId: req.user._id });
      if (cart) {
        cartLength = cart.items.length;
        cart.items.forEach((item) => {
          if (item.productId === productId) is_added = true;
        });
      }
    } else if (req.cookies.cart) {
      const guestCart = JSON.parse(req.cookies.cart);
      cartLength = guestCart.length;
      guestCart.forEach((item) => {
        if (item.productId === productId) is_added = true;
      });
    }

    res.render("pages/productdetail", {
      product: product || null,
      user: req.user || null,
      cartLength,
      is_added,
    });
  } catch (error) {
    req.previous_url = "/others/hcareproduct";
    next(error);
  }
});

// User's Selected pincode
router.get("/get-pincode", (req, res) => {
  const pincode = req.cookies.pincode || (req.user ? req.user.pincode : null);
  res.json({ pincode });
});

router.post("/set-pincode", async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    return res
      .status(400)
      .json({ success: false, error: "Pincode is required." });
  }

  try {
    if (req.user) {
      req.user.pincode = pincode;
      await req.user.save();
    } else {
      res.cookie("pincode", pincode, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    res.status(200).json({ message: "Pincode added", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
});

router.get("/diagnose", (req, res) => {
  res.render("pages/diagnose", { user: req.user || null });
});

module.exports = router;
