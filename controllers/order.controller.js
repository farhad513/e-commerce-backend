const { Orders } = require("../models/order.model");
const { Products } = require("../models/product.model");
const stripe = require("../server");

const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharge,
      totalPrice,
      paymentMethod,
    } = req.body;
    // if (
    //   !shippingInfo ||
    //   !orderItems ||
    //   !paymentInfo ||
    //   !itemPrice ||
    //   !tax ||
    //   !shippingCharge ||
    //   !totalPrice ||
    //   !paymentMethod
    // ) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please provide all fields",
    //   });
    // }
    await Orders.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharge,
      totalPrice,
      paymentMethod,
    });
    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await Products.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(200).send({
      success: true,
      message: "Order Created Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Order Controller Error",
      error,
    });
  }
};

// get My Orders
const getMyOrdersController = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Get My Order Success",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Order Controller Error",
      error,
    });
  }
};

// get Single Order Info Controller
const getSingleOrderDetails = async (req, res) => {
  try {
    // find Order
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Single Order Success",
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      res.status(500).send({
        success: false,
        message: "Invalid Order Id",
      });
    }
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Order Controller Error",
      error,
    });
  }
};

// accept Controller
const paymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is required",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "bdt",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Payment Order Controller Error",
      error,
    });
  }
};

// get All Order access admin
const adminAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({});
    res.status(200).send({
      success: true,
      message: "Get All Orders",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin  Order Controller Error",
      error,
    });
  }
};

// change Order Status Controller
const orderStatusController = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipping";
    else if (order.orderStatus === "shipping") {
      order.orderStatus = "delivery";
      order.deliveryAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "Order Already Delivered",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "Order Status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin  Order Status Controller Error",
      error,
    });
  }
};
module.exports = {
  createOrderController,
  getMyOrdersController,
  getSingleOrderDetails,
  paymentController,
  adminAllOrders,
  orderStatusController,
};
