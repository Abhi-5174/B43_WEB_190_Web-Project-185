const express = require("express");

const router = express.Router();

router.get("/view_cart", (req, res) => {
  res.render("pages/view_cart", { user: req.user || null });
});

router.get("/hcareProduct", (req, res) => {
  res.render("pages/hcareProduct", { user: req.user || null });
});

router.get("/diagnose", (req, res) => {
  res.render("pages/diagnose", { user: req.user || null });
});

module.exports = router;
