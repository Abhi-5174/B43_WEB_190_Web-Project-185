const User = require("../models/User");

module.exports.getAllUsers = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }
  try {
    const users = await User.find().select("-password");

    res.render("pages/admin/users", { users });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.editUser = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/users/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const user = await User.findById(id);

    user.role = user.role == "user" ? "admin" : "user";

    await user.save();

    res.redirect("/admin/users/1111");
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/users/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const user = await User.findByIdAndDelete(id);

    res.redirect("/admin/users/1111");
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
