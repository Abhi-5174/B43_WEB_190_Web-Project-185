require("../config/passport");

const express = require("express");
const passport = require("passport");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  authCallback,
  authProfile,
} = require("../controllers/auth.controllers");

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
  authCallback
);

router.get("/profile", isAuthenticated, authProfile);

module.exports = router;
