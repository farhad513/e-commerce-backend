const mongoose = require("mongoose");
// const { Reviews } = require("./review.model");
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    rating: {
      type: Number,
      //   required: [true, "Rating is required"],
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product Stock is required"],
    },
    // quantity: {
    //   type: Number,
    //   required: [true, "Product quantity is required"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numOfReview: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports.Products = mongoose.model("Products", productSchema);
