const Pincode = require("../models/Pincode");
const redisClient = require("../config/redis");

module.exports.getPincodePage = async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const pincodes = await Pincode.find();

    res.render("pages/admin/pincodes", { pincodes });
  } catch (error) {
    res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getAddPincodePage = async (req, res) => {
  res.render("pages/admin/addpincode");
};

module.exports.postAddPincode = async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/pincodes/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const { pincode } = req.body;

    const newPincode = await Pincode.create({ pincode });

    const cachedPincodes = await redisClient.get("pincodes");
    let pincodes = cachedPincodes ? JSON.parse(cachedPincodes) : [];

    pincodes.push(newPincode);

    await redisClient.set("pincodes", JSON.stringify(pincodes), "EX", 3600);

    res.render("pages/admin/pincodes", { pincodes });
  } catch (error) {
    return res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.deletePincode = async (req, res) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/pincodes/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    await Pincode.findByIdAndDelete(id);

    await redisClient.del("pincodes");

    res.redirect("/admin/pincodes/1111");
  } catch (error) {
    return res.redirect(
      "/admin/pincodes/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
