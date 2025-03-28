const express = require("express");

const {upload, cloudinary} = require("../config/multer");
const adminController = require("../controllers/admin.controllers");
const adminUsersController = require("../controllers/admin.users.controller");
const adminProductsController = require("../controllers/admin.products.controller");
const adminPincodesController = require("../controllers/admin.pincodes.controller");
const adminOrdersController = require("../controllers/admin.orders.controller");
const adminCategoriesController = require("../controllers/admin.categories.controller");

const router = express.Router();

router.get("/:pass", adminController.getAdminPage);

// Admin User
router.get("/users/:pass", adminUsersController.getAllUsers);

router.get("/edit-user/:id/:pass", adminUsersController.editUser);

router.get("/delete-user/:id/:pass", adminUsersController.deleteUser);

// Admin Categories
router.get("/categories/:pass", adminCategoriesController.getCategoriesPage);

router.get("/add-category/:pass", adminCategoriesController.getAddCategoryPage);

router.post(
  "/add-category/:pass",
  upload.single("image"),
  adminCategoriesController.postAddCategory
);

router.get(
  "/edit-category/:id/:pass",
  adminCategoriesController.getEditCategoryPage
);

router.post(
  "/edit-category/:id/:pass",
  upload.single("image"),
  adminCategoriesController.postEditCategory
);

router.get(
  "/delete-category/:id/:pass",
  adminCategoriesController.deleteCategory
);

// Admin Products
router.get("/products/:pass", adminProductsController.getProductsPage);

router.get("/add-product/:pass", adminProductsController.getAddProductPage);

router.post(
  "/add-product/:pass",
  upload.single("image"),
  adminProductsController.postAddProducts
);

router.get(
  "/edit-product/:id/:pass",
  adminProductsController.getEditProductPage
);

router.post(
  "/edit-product/:id/:pass",
  upload.single("image"),
  adminProductsController.postEditProduct
);

router.get("/delete-product/:id/:pass", adminProductsController.deleteProducts);

// Admin Pincode
router.get("/pincodes/:pass", adminPincodesController.getPincodePage);

router.get("/add-pincode/:pass", adminPincodesController.getAddPincodePage);

router.post("/add-pincode/:pass", adminPincodesController.postAddPincode);

router.get("/delete-pincode/:id/:pass", adminPincodesController.deletePincode);

// Admin Orders
router.get("/orders/:pass", adminOrdersController.getOrdersPage);

router.get("/delete-order/:id/:pass", adminOrdersController.deleteOrder);

// Admin Reports
router.get("/reports/:pass", adminController.getReportsPage);

// Admin Setting
router.get("/settings/:pass", adminController.getSettingsPage);

module.exports = router;
