const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.getCartPage = async (req, res) => {
  let cartItems = [];

  if (req.user) {
    const userCart = await Cart.findOne({ userId: req.user._id })
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .lean();

    cartItems = userCart && userCart.items ? userCart.items : [];
  } else {
    let guestCart = [];
    try {
      guestCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    } catch (error) {
      console.error("Invalid cart cookie:", error);
      guestCart = [];
    }
    const productIds = guestCart.map((item) => item.productId);

    if (productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      cartItems = guestCart
        .map((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.productId
          );
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item) => item !== null); // Remove nulls if any product is missing
    }
  }

  res.render("pages/cart", { cart: cartItems, user: req.user || null });
};

module.exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

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
        existingItem.quantity += quantity;
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
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }

      res.cookie("cart", JSON.stringify(cart), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ message: "Added to cart (Guest user)" });
    }
  } catch (error) {
    req.previous_url = "/carts/add";
    next(error);
  }
};
