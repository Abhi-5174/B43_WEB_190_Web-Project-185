module.exports = (req, res) => {
  res.render("pages/pageNotFound", { user: req.user });
};
