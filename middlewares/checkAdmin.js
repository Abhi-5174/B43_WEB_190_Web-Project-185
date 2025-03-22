module.exports = (req, res, next) => {
  if (req.user && req.user.email == process.env.ADMIN_EMAIL) return next();
  else if (!req.user || req.user.role !== "admin") {
    return res.render("pages/error", {
      errorMessage: "Unauthorized!",
      user: req.user || null,
      previous_url: "/",
    });
  }
  next();
};
