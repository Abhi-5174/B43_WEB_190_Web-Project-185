const Pincode = require("../models/Pincode");

module.exports = async (req, res, next) => {
  try {
    const pincodes = await Pincode.find({}, "pincode");
    res.locals.pincodes = pincodes;
    next();
  } catch (error) {
    console.error("Error fetching pincodes:", error);
    res.locals.pincodes = [];
    next();
  }
};
