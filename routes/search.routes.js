const express = require("express");

const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { q } = req.query;
  if (!q)
    return res.render("pages/search", {
      results: [],
      query: "",
      user: req.user || null,
    });
  try {
    const results = await Product.find({
      name: { $regex: q, $options: "i" },
    }).limit(10);

    res.render("pages/search", { results, query: q, user: req.user || null });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
