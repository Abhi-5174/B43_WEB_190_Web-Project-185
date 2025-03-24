const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Pincode = require("../models/Pincode");

module.exports.getCartPage = async (req, res, next) => {
  let cartItems = [];

  if (req.user) {
    // Fetch cart for logged-in user
    const userCart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId")
      .lean();

    cartItems = userCart?.items || [];
  } else {
    // Handle guest cart
    let guestCart = [];
    try {
      guestCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    } catch (error) {
      guestCart = [];
    }

    // Extract only _id from productId
    const productIds = guestCart.map(
      (item) => item.productId?._id || item.productId
    );

    if (productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      cartItems = guestCart
        .map((item) => {
          // Ensure correct ID format
          const productId =
            item.productId?._id?.toString() || item.productId.toString();
          const product = products.find((p) => p._id.toString() === productId);

          return product ? { product, quantity: item.quantity } : null;
        })
        .filter(Boolean); // Remove null values
    }
  }

  try {
    const pincodes = await Pincode.find();

    res.render("pages/cart", {
      cart: cartItems,
      user: req.user || null,
      pincodes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.addToCart = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.query;

  try {
    if (req.user) {
      // User is logged in, update MongoDB cart
      let cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [] });
      }

      const existingItem = cart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      return res.redirect("/carts");
    } else {
      // Guest user, store in cookies
      let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

      const existingItem = cart.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.push({ productId, quantity });
      }

      res.cookie("cart", JSON.stringify(cart), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.redirect("/carts");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.removeFromCart = async (req, res, next) => {
  const { productId } = req.params;

  try {
    if (req.user) {
      // User is logged in, update MongoDB cart
      let cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        return res.redirect("/carts");
      }

      cart.items.forEach((item, i) => {
        if (item.productId === productId) {
          cart.items.splice(i, 1);
        }
      });

      await cart.save();
      return res.redirect("/carts");
    } else {
      // Guest user, store in cookies
      let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : null;

      if (!cart) {
        console.log("No carts");
        return res.redirect("/carts");
      }

      cart = cart.filter((item) => item.productId !== productId);

      res.cookie("cart", JSON.stringify(cart), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.redirect("/carts");
    }
  } catch (error) {
    next(error);
  }
};
