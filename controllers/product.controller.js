const { Products } = require("../models/product.model");
const getDataUri = require("../utils/feature");
const cloudinary = require("cloudinary").v2;
const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).send({
      success: true,
      message: "Get All Products",
      productCount: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get All Product Controller Error",
      error,
    });
  }
};

// get Single Product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single Product Found",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Get Single Product Controller Error",
      error,
    });
  }
};
// create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // if (!name || !description || !price || !stock) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please Provide All Fields",
    //   });
    // }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Product Image",
      });
    }
    const file = getDataUri(req.file);
    const cloudImage = await cloudinary.uploader.upload(file.content);
    const image = {
      public_id: cloudImage.public_id,
      url: cloudImage.secure_url,
    };
    await Products.create({
      name,
      description,
      price,
      stock,
      category,
      images: [image],
    });
    res.status(200).send({
      success: true,
      message: "Product Created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Create Product Controller Error",
      error,
    });
  }
};

// update Product Controller
const updateProductController = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    // save product
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Update Success",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Update Product Controller Error",
      error,
    });
  }
};

// product Image Controlller
const productImageController = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product Image Not Found",
      });
    }
    const file = getDataUri(req.file);
    const cloudImage = await cloudinary.uploader.upload(file.content);
    const image = {
      public_id: cloudImage.public_id,
      url: cloudImage.secure_url,
    };
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image Update success",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Update Product Image Controller Error",
      error,
    });
  }
};

// product Image Delete Controller
const productImageDeleteController = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Product Image Not Found",
      });
    }
    let exist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) exist = index;
    });
    if (exist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image Not Found",
      });
    }
    await cloudinary.uploader.destroy(product.images[exist].public_id);
    product.images.splice(exist, 1);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image Update Successful",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Update Product Image Controller Error",
      error,
    });
  }
};
// delete Product
const deleteProductController = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    // find and delete Image Cloudenary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update Product Image Controller Error",
      error,
    });
  }
};

// product review Controlller
const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const product = await Products.findById(req.params.id);
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.send({
        success: false,
        message: "Product Review already reviewed",
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numOfReview = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save Product
    await product.save();
    res.status(200).send({
      success: true,
      message: "Reviews Added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: " Product Review Controller Error",
      error,
    });
  }
};
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProductController,
  productImageController,
  productImageDeleteController,
  deleteProductController,
  productReviewController,
};
