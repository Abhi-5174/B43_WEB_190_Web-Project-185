const express = require("express");

const upload = require("../config/multer");
const adminController = require("../controllers/admin.controllers");
const adminUsersController = require("../controllers/admin.users.controller");
const adminProductsController = require("../controllers/admin.products.controller");
const adminPincodesController = require("../controllers/admin.pincodes.controller");
const adminOrdersController = require("../controllers/admin.orders.controller");

const router = express.Router();

router.get("/:pass", adminController.getAdminPage);

// Admin User page
router.get("/users/:pass", adminUsersController.getAllUsers);

router.get("/edit-user/:id/:pass", adminUsersController.editUser);

router.get("/delete-user/:id/:pass", adminUsersController.deleteUser);

// Admin Products page
router.get("/products/:pass", adminProductsController.getProductsPage);

router.get("/add-product/:pass", adminProductsController.getAddProductPage);

router.post(
  "/add-product/:pass",
  upload.single("image"),
  adminProductsController.postAddProducts
);

router.get("/edit-product/:id/:pass", adminProductsController.postEditProduct);

router.post(
  "/edit-product/:id/:pass",
  upload.single("image"),
  adminProductsController.postEditProduct
);

router.get("/delete-product/:id/:pass", adminProductsController.deleteProducts);

// Admin Pincode
router.get("/pincodes/:pass", adminPincodesController.getPincodePage);

router.get("/add-pincode/:pass", adminPincodesController.postAddPincode);

router.post("/add-pincode/:pass", adminPincodesController.postAddPincode);

router.get("/delete-pincode/:id/:pass", adminPincodesController.deletePincode);

router.get("/orders/:pass", adminOrdersController.getOrdersPage);

router.get("/delete-order/:id/:pass", adminOrdersController.deleteOrder);

// Admin Reports
router.get("/reports/:pass", adminController.getReportsPage);

// Admin Setting
router.get("/settings/:pass", adminController.getSettingsPage);

module.exports = router;
