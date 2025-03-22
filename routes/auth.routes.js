const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middlewares/isAuthenticated");
require("../config/passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    const { token, user } = req.user;

    res.cookie("auth_token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect("/auth/profile");
  }
);

router.get("/profile", isAuthenticated, (req, res) => {
  try {
    res.redirect(`/`);
  } catch (error) {
    console.log("Invalid Token");
    res.clearCookie("auth_token");
    res.redirect("/");
  }
});

module.exports = router;
