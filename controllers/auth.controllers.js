const User = require("../models/User");
const Cart = require("../models/Cart");
const AuthCookie = require("../utils/cookie");
const sendResetEmail = require("../utils/mailer");
const jwt = require("../utils/jwt");

module.exports.authCallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }

  const { token, user } = req.user;

  AuthCookie.setAuthCookie(res, token);

  res.redirect("/auth/profile");
};

module.exports.authProfile = (req, res) => {
  res.redirect(`/`);
};

module.exports.getLoginPage = (req, res, next) => {
  res.render("pages/login", {
    showPopup: null,
    message: null,
    bgcolor: null,
    color: null,
  });
};

module.exports.postLogin = async (req, res, next) => {
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

    const token = jwt.generateToken(user._id);

    AuthCookie.setAuthCookie(res, token);

    let userCart = await Cart.findOne({ userId: user._id });
    if (!userCart) {
      userCart = new Cart({ userId: user._id, items: [] });
    }

    const guestCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    guestCart.forEach((guestItem) => {
      const quantity = Number(guestItem.quantity) || 1;
      const existingItem = userCart.items.find(
        (cartItem) => cartItem.productId.toString() === guestItem.productId
      );

      if (existingItem) {
        existingItem.quantity += quantity; // Update quantity
      } else {
        userCart.items.push({
          productId: guestItem.productId,
          quantity,
        });
      }
    });

    await userCart.save();

    // Clear Guest Cart from Cookies
    res.clearCookie("cart");

    res.redirect("/");
  } catch (error) {
    req.previous_url = "/users/login";
    next(error);
  }
};

module.exports.getForgotPasswordPage = async (req, res, next) => {
  res.render("pages/forgotPassword", {
    showPopup: null,
    message: null,
    bgcolor: null,
    color: null,
  });
};

module.exports.postForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.redirect(
        "/users/forgot-password?error=" +
          encodeURIComponent("Email is required!")
      );

    const user = await User.findOne({ email });

    if (!user)
      return res.redirect(
        "/users/forgot-password?error=" + encodeURIComponent("User not found!")
      );

    const resetToken = jwt.generateResetToken(email);

    const token = jwt.generateToken(user._id);

    AuthCookie.setAuthCookie(res, token);

    // Extract base URL dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const resetLink = `${baseUrl}/users/reset-password/${resetToken}`;

    await sendResetEmail(email, resetLink);

    res.render("pages/login", {
      showPopup: true,
      message: "Reset link sent to your email",
      bgcolor: "lightGreen",
      color: "black",
    });
  } catch (error) {
    return res.redirect(
      "/users/forgot-password?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getResetPasswordPage = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verifyResetToken(token);

  if (!decoded)
    return res.redirect(
      "/users/forgot-password?error=" + encodeURIComponent("Invalid token")
    );

  res.render("pages/resetPassword", {
    showPopup: false,
    message: null,
    bgcolor: null,
    color: null,
    token,
  });
};

module.exports.postResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
      return res.redirect(
        `/users/reset-password/${token}?error=${encodeURIComponent(
          "All fields are required!"
        )}`
      );

    if (password !== confirmPassword)
      return res.redirect(
        `/users/reset-password/${token}?error=${encodeURIComponent(
          "Passwords do not match!"
        )}`
      );

    const decoded = jwt.verifyResetToken(token);
    if (!decoded)
      return res.redirect(
        "/users/forgot-password?error=" +
          encodeURIComponent("Invalid or expired token!")
      );

    const user = await User.findOne({ email: decoded.email });
    if (!user)
      return res.redirect(
        "/users/forgot-password?error=" + encodeURIComponent("User not found!")
      );

    user.password = password;
    await user.save();

    res.redirect("/");
  } catch (error) {
    res.redirect(
      "/users/forgot-password?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getSignupPage = (req, res, next) => {
  res.render("pages/signup");
};

module.exports.postSignup = async (req, res, next) => {
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

    const token = jwt.generateToken(user._id);

    AuthCookie.setAuthCookie(res, token);

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
};
