const mongoose = require("mongoose");

const PincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pincode", PincodeSchema);
