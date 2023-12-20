const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Product Category Name is required"],
    },
  },
  { timestamps: true }
);

module.exports.Categorys = mongoose.model("Category", categorySchema);
