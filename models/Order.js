const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links order to a user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0, // Will be auto-updated using aggregation
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    address: {
      fullName: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
      },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Postal code must be 6 digits"],
      },
      country: { type: String, required: true, default: "India" },
    },
  },
  { timestamps: true }
);

// Middleware to auto-fetch total price using lookup
OrderSchema.pre("save", async function (next) {
  const order = this;
  const Product = mongoose.model("Product");

  // Fetch product prices and calculate total
  const products = await Product.find({
    _id: { $in: order.items.map((item) => item.product) },
  });

  order.totalPrice = products.reduce((sum, prod) => sum + prod.price, 0);

  next();
});

module.exports = mongoose.model("Order", OrderSchema);
