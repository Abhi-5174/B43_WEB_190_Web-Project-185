const Order = require("../models/Order");

module.exports.getOrdersPage = async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const orders = await Order.find();

    res.render("pages/admin/orders", { orders });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.deleteOrder = async (req, res) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    await Order.findByIdAndDelete(id);

    res.redirect("/admin/orders/1111");
  } catch (error) {
    return res.redirect(
      "/admin/orders/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
