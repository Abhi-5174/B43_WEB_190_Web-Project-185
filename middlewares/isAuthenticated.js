const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    req.user = null; // No user found
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    req.user = user; // Attach user details
  } catch (error) {
    req.user = null; // Invalid token
  }

  next();
};

module.exports = isAuthenticated;
