const Pincode = require("../models/Pincode");
const redisClient = require("../config/redis");

module.exports = async (req, res, next) => {
  try {
    const cacheKey = "pincodes";

    const cachedPincodes = await redisClient.get(cacheKey);
    if (cachedPincodes) {
      res.locals.pincodes = JSON.parse(cachedPincodes);
      return next();
    }

    const pincodes = await Pincode.find({}, "pincode");

    await redisClient.set(cacheKey, JSON.stringify(pincodes), "EX", 3600);

    res.locals.pincodes = pincodes;
    next();
  } catch (error) {
    console.error("Error fetching pincodes:", error);
    res.locals.pincodes = [];
    next();
  }
};
