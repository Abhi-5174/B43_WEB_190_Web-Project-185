const Category = require("../models/Category");
const Product = require("../models/Product");
const deleteImage = require("../utils/fileUtils");

module.exports.getCategoriesPage = async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent("Auth password is required")
    );
  }

  try {
    const categories = await Category.find();

    res.render("pages/admin/categories", { categories });
  } catch (error) {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getAddCategoryPage = async (req, res) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    return res.redirect(
      "/admin/1111?error=" + encodeURIComponent("Auth password is required")
    );
  }

  res.render("pages/admin/addcategory");
};

module.exports.postAddCategory = async (req, res, next) => {
  const { pass } = req.params;
  if (!pass || pass !== "1111") {
    const err = new Error("Access denied!");
    req.previous_url = "/admin/add-category/1111";
    return next(err);
  }

  try {
    const { name, discount } = req.body;
    let imagePath;

    if (process.env.NODE_ENV === "production") {
      imagePath = req.file.path;
    } else {
      imagePath = "/uploads/" + req.file.filename;
    }

    const newCategory = new Category({
      name,
      discount,
      image: imagePath,
    });

    await newCategory.save();

    res.redirect("/admin/categories/1111");
  } catch (error) {
    res.redirect(
      "/admin/add-category/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.getEditCategoryPage = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/categories/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }

  try {
    const category = await Category.findById(id);

    res.render("pages/admin/editcategory", { category });
  } catch (error) {
    req.previous_url = "/admin/categories/1111";
    next(error);
  }
};

module.exports.postEditCategory = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/categories/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const { name, discount } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.redirect(
        "/admin/categories/1111?error=" +
          encodeURIComponent("category not found")
      );
    }

    if (req.file) {
      deleteImage(category.image);

      if (process.env.NODE_ENV === "production") {
        category.image = req.file.path;
      } else {
        category.image = "/uploads/" + req.file.filename;
      }
    }

    // Update category
    category.name = name;
    category.discount = discount;

    await category.save();

    res.redirect("/admin/categories/1111");
  } catch (error) {
    return res.redirect(
      "/admin/categories/1111?error=" + encodeURIComponent(error.message)
    );
  }
};

module.exports.deleteCategory = async (req, res, next) => {
  const { id, pass } = req.params;
  if (!pass || pass !== "1111" || !id) {
    return res.redirect(
      "/admin/categories/1111?error=" +
        encodeURIComponent("User ID and Auth password is required")
    );
  }
  try {
    const products = await Product.find({ category: id });

    if (products.length > 0) {
      return res.redirect(
        "/admin/categories/1111?error=" +
          encodeURIComponent(
            `Cannot delete! ${products.length} products are added to this category`
          )
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (category && category.image) {
      deleteImage(category.image);
    }

    res.redirect("/admin/categories/1111");
  } catch (error) {
    return res.redirect(
      "/admin/categories/1111?error=" + encodeURIComponent(error.message)
    );
  }
};
