const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProductController,
  productImageController,
  productImageDeleteController,
  deleteProductController,
  productReviewController,
} = require("../controllers/product.controller");
const { isAuth, isAdmin } = require("../middlewares/isAuth");
const singleUpload = require("../middlewares/multer");

const router = require("express").Router();

// get All Products
router.get("/all-products", getAllProducts);

// get Single Products
router.get("/:id", getSingleProduct);

// create Product
router.post("/create-product", isAuth, isAdmin, singleUpload, createProduct);

// update Product
router.put("/:id", isAuth, isAdmin, updateProductController);

// update Image Product
router.put("/image/:id", isAuth, isAdmin, singleUpload, productImageController);

// Delete Image Product
router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  productImageDeleteController
);

// delete Product
router.delete("/:id", isAuth, isAdmin, deleteProductController);

// product review
router.put("/:id/review", isAuth, productReviewController);

module.exports = router;
