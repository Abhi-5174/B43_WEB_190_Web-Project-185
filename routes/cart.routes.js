const express = require("express");

const cartController = require("../controllers/cart.controllers");

const router = express.Router();

router.get("/", cartController.getCartPage);

router.get("/add-to-cart/:productId", cartController.addToCart);

router.get("/remove-from-cart/:productId", cartController.removeFromCart);

module.exports = router;
