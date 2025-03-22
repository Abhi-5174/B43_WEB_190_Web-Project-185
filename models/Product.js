const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name must not exceed 100 characters"],
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer name is required"],
      trim: true,
      minlength: [2, "Manufacturer name must be at least 2 characters"],
      maxlength: [100, "Manufacturer name must not exceed 100 characters"],
    },
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
      trim: true,
      match: [
        /^\d+\s?(tablet|capsule|ml|mg|strip|bottle|pack|g)$/i,
        "Invalid quantity format (e.g., '10 tablet', '100 ml')",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
      validate: {
        validator: function (value) {
          return value >= this.price; // MRP should always be greater than or equal to price
        },
        message: "MRP should be greater than or equal to price",
      },
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot be more than 100%"],
    },
    image: {
      type: String,
      // required: [true, "Image URL is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
