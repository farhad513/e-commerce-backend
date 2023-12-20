const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product Name is Required"],
        },
        price: {
          type: Number,
          required: [true, "Product Price is Required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product Quantity is Required"],
        },
        image: {
          type: String,
          required: [true, "Product Image is Required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["CASH", "ONLINE"],
      default: "CASH",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "Item Price is Required"],
    },
    tax: {
      type: Number,
      required: [true, "Tax Price is Required"],
    },
    shippingCharge: {
      type: Number,
      required: [true, "Shipping  Price is Required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total Price is Required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipping", "delivery", "cancelled"],
      default: "processing",
    },
    deliveryAt: Date,
  },
  { timestamps: true }
);

module.exports.Orders = mongoose.model("Orders", orderSchema);
