const Product = require("../models/Product");

module.exports.getProductsPage = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }
  try {
    const products = await Product.find();

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

  res.render("pages/admin/addproduct");
};

module.exports.postAddProducts = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    return next(err);
  }

  try {
    const { name, manufacturer, quantity, price, mrp, discount } = req.body;
    const imagePath = req.file ? "/uploads/" + req.file.filename : "";

    if (mrp < price) {
      return res.redirect(
        "/admin/add-product/1111?error=" +
          encodeURIComponent("MRP should be greater than price!")
      );
    }

    const newMedicine = new Product({
      name,
      manufacturer,
      quantity,
      price,
      mrp,
      discount,
      image: imagePath,
    });

    await newMedicine.save();

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

  const product = await Product.findById(id);

  res.render("pages/admin/editproduct", { product });
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
    const { name, manufacturer, quantity, price, mrp, discount } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.redirect(
        "/admin/products/1111?error=" + encodeURIComponent("Product not found")
      );
    }

    let imagePath = product.image;

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;

      // Delete old image file if it exists
      if (product.image && fs.existsSync("public" + product.image)) {
        fs.unlinkSync("public" + product.image);
      }
    }

    // Update Product
    product.name = name;
    product.manufacturer = manufacturer;
    product.quantity = quantity;
    product.price = price;
    product.mrp = mrp;
    product.discount = discount;
    product.image = imagePath;

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

    res.redirect("/admin/products/1111");
  } catch (error) {
    return res.redirect(
      "/admin/products/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
