const { Categorys } = require("../models/category.model");
const { Products } = require("../models/product.model");

const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    // console.log(category);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    await Categorys.create({ category });
    res.status(200).send({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Category Error Controller",
    });
  }
};

// get All Cateogy
const getAllCategory = async (req, res) => {
  try {
    const category = await Categorys.find({});
    res.status(200).send({
      success: true,
      message: "Get All Categories",
      categoryCount: category.length,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get All Category Error Controller",
    });
  }
};

// delete category
const deleteCategoryController = async (req, res) => {
  try {
    const category = await Categorys.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    // find product with category id
    const products = await Products.find({ category: category._id });
    // update Products category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }

    // delete
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Category Delete Success",
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Category Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Update Product Image Controller Error",
      error,
    });
  }
};

// update Category
const updateCategoryController = async (req, res) => {
  try {
    // updateCategory
    const { updateCateory } = req.body;
    const category = await Categorys.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    // find product with category id
    const products = await Products.find({ category: category._id });

    // update Products category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updateCateory;
      await product.save();
    }
    if (updateCateory) category.category = updateCateory;
    // save
    await category.save();
    res.status(200).send({
      success: true,
      message: "Category Update Success",
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Category Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Update Product Image Controller Error",
      error,
    });
  }
};
module.exports = {
  createCategory,
  getAllCategory,
  deleteCategoryController,
  updateCategoryController,
};
