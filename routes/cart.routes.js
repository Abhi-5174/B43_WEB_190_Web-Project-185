const express = require("express");

const cartController = require("../controllers/cart.controllers");

const router = express.Router();

router.get("/", cartController.getCartPage);

router.post("/add-to-cart", cartController.addToCart);

module.exports = router;
