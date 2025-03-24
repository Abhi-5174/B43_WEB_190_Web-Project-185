require("../config/passport");

const express = require("express");
const passport = require("passport");

const isAuthenticated = require("../middlewares/isAuthenticated");
const authController = require("../controllers/auth.controllers");

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
  authController.authCallback
);

router.get("/profile", isAuthenticated, authController.authProfile);

module.exports = router;
