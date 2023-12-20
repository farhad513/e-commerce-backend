const router = require("express").Router();
const {
  createCategory,
  getAllCategory,
  deleteCategoryController,
  updateCategoryController,
} = require("../controllers/category.controller");
const { isAuth, isAdmin } = require("../middlewares/isAuth");

// crate Category
router.post("/create", isAuth, isAdmin, createCategory);
router.get("/get-all-category", getAllCategory);
router.delete("/delete-cat/:id", isAuth, isAdmin, deleteCategoryController);
router.put("/update-cat/:id", isAuth, isAdmin, updateCategoryController);
module.exports = router;
