const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Cart = require("../models/Cart");
const upload = require("../config/multer");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/login", (req, res, next) => {
  res.render("pages/login", {
    showPopup: null,
    message: null,
    bgcolor: null,
    color: null,
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect(
        "/users/login?error=" +
          encodeURIComponent("Email and password are required.")
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.redirect(
        "/users/login?error=" + encodeURIComponent("Invalid email or password.")
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.redirect(
        "/users/login?error=" + encodeURIComponent("Invalid email or password.")
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    let userCart = await Cart.findOne({ userId: user._id });
    if (!userCart) {
      userCart = new Cart({ userId: user._id, items: [] });
    }

    const guestCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    guestCart.forEach((guestItem) => {
      const existingItem = userCart.items.find(
        (cartItem) => cartItem.medicineId.toString() === guestItem.productId
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity; // Update quantity
      } else {
        userCart.items.push({
          medicineId: guestItem.productId,
          quantity: guestItem.quantity,
        });
      }
    });

    // Clear Guest Cart from Cookies
    res.clearCookie("cart");

    res.redirect("/");
  } catch (error) {
    req.previous_url = "/users/login";
    next(error);
  }
});

router.get("/signup", (req, res, next) => {
  res.render("pages/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.redirect(
        "/users/signup?error=" + encodeURIComponent("Passwords do not match")
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(
        "/users/signup?error=" +
          encodeURIComponent("Email is already registered.")
      );
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.render("pages/login", {
      showPopup: true,
      message: "Signup Successfull please login",
      bgcolor: "lightGreen",
      color: "black",
    });
  } catch (error) {
    return res.redirect(
      "/users/signup?error=" + encodeURIComponent(error.message)
    );
  }
});

router.post(
  "/upload",
  isAuthenticated,
  upload.single("photo"),
  async (req, res, next) => {
    if (!req.file) {
      return res.render("pages/error", {
        errorMessage: "No file uploaded!",
        user: req.user,
        previous_url: "/users/profile",
      });
    }

    if (!req.user)
      return res.redirect("/users/login", {
        showPopup: true,
        message: "Please login first!",
        bgcolor: "red",
        color: "white",
      });

    try {
      req.user.photo = req.file.filename;
      await req.user.save();

      res.redirect("/users/profile");
    } catch (error) {
      req.previous_url = "/users/profile";
      next(error);
    }
  }
);

router.get("/profile", isAuthenticated, (req, res, next) => {
  if (!req.user)
    return res.status(500).render("pages/error", {
      errorMessage: "You need to login first!",
    });

  res.render("pages/profile", { user: req.user });
});

router.post("/update-profile", isAuthenticated, async (req, res, next) => {
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
});

router.get("/offer", isAuthenticated, (req, res, next) => {
  res.render("pages/offer", { user: req.user || null });
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("auth_token");
  res.redirect("/");
});

module.exports = router;
