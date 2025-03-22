const express = require("express");

const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const cartRouter = require("./cart.routes");
const adminRouter = require("./admin.routes");
const searchRouter = require("./search.routes");
const othersRouter = require("./others.routes");
const isAdmin = require("../middlewares/checkAdmin");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
  // For admin
  if (req.user && req.user.email == process.env.ADMIN_EMAIL) {
    return res.redirect("/admin/1111");
  }
  return res.render("homepage", { user: req.user || null });
});

router.use("/auth", authRouter);

router.use("/users", isAuthenticated, userRouter);

router.use("/search", isAuthenticated, searchRouter);

router.use("/carts", isAuthenticated, cartRouter);

router.use("/others", isAuthenticated, othersRouter);

router.use("/admin", isAuthenticated, isAdmin, adminRouter);

module.exports = router;
