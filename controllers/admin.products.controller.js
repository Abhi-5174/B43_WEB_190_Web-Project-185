const Category = require("../models/Category");
const Product = require("../models/Product");
const deleteImage = require("../utils/fileUtils");

module.exports.getProductsPage = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }
  try {
    const products = await Product.find().populate("category");

    res.render("pages/admin/products", { products });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getAddProductPage = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  try {
    const categories = await Category.find();

    res.render("pages/admin/addproduct", { categories });
  } catch (error) {
    req.previous_url = "/admin/1111";
    next(error);
  }
};

module.exports.postAddProducts = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  try {
    const { name, manufacturer, quantity, price, mrp, discount, category } =
      req.body;
    const imagePath = req.file ? "/uploads/" + req.file.filename : "";

    if (mrp < price) {
      return res.redirect(
        "/admin/add-product/1111?error=" +
          encodeURIComponent("MRP should be greater than price!")
      );
    }

    const newProduct = new Product({
      name,
      manufacturer,
      quantity,
      price,
      mrp,
      discount,
      image: imagePath,
      category,
    });

    await newProduct.save();

    res.redirect("/admin/products/1111");
  } catch (error) {
    res.redirect(
      "/admin/add-product/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getEditProductPage = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/products/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const categories = await Category.find();

    const product = await Product.findById(id);

    res.render("pages/admin/editproduct", { product, categories });
  } catch (error) {
    return res.redirect(
      "/admin/products/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.postEditProduct = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/products/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const { name, manufacturer, quantity, price, mrp, discount, category } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.redirect(
        "/admin/products/1111?error=" + encodeURIComponent("Product not found")
      );
    }

    let imagePath = product.image;

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;

      deleteImage(product.image);
    }

    // Update Product
    product.name = name;
    product.manufacturer = manufacturer;
    product.quantity = quantity;
    product.price = price;
    product.mrp = mrp;
    product.discount = discount;
    product.image = imagePath;
    product.category = category;

    await product.save();

    res.redirect("/admin/products/1111");
  } catch (error) {
    return res.redirect(
      "/admin/products/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.deleteProducts = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/products/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const product = await Product.findByIdAndDelete(id);

    if (product && product.image) {
      deleteImage(product.image);
    }

    res.redirect("/admin/products/1111");
  } catch (error) {
    return res.redirect(
      "/admin/products/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
