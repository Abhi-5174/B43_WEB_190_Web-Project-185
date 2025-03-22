module.exports = (err, req, res, next) => {
  if (err) {
    return res.status(err.status || 500).render("pages/error", {
      errorMessage: err.message || "Something went wrong!",
      user: req.user || null,
      previous_url: req.previous_url || "/",
    });
  }
};
