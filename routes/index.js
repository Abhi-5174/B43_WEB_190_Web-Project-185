const express = require("express");

const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const cartRouter = require("./cart.routes");
const adminRouter = require("./admin.routes");
const searchRouter = require("./search.routes");
const othersRouter = require("./others.routes");
const isAdmin = require("../middlewares/checkAdmin");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Pincode = require("../models/Pincode");

const router = express.Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  // For admin
  if (req.user && req.user.email == process.env.ADMIN_EMAIL) {
    return res.redirect("/admin/1111");
  }
  try {
    const pincodes = await Pincode.find();

    return res.render("homepage", { user: req.user || null, pincodes });
  } catch (error) {
    next(error);
  }
});

router.use("/auth", authRouter);

router.use("/users", isAuthenticated, userRouter);

router.use("/search", isAuthenticated, searchRouter);

router.use("/carts", isAuthenticated, cartRouter);

router.use("/others", isAuthenticated, othersRouter);

router.use("/admin", isAuthenticated, isAdmin, adminRouter);

module.exports = router;
