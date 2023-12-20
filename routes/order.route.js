const {
  createOrderController,
  getMyOrdersController,
  getSingleOrderDetails,
  paymentController,
  adminAllOrders,
  orderStatusController,
} = require("../controllers/order.controller");
const { isAuth, isAdmin } = require("../middlewares/isAuth");
const router = require("express").Router();

// create order route
router.post("/create", isAuth, createOrderController);

// Get My Ordes
router.get("/my-orders", isAuth, getMyOrdersController);
// Get Single  Order info
router.get("/my-order/:id", isAuth, getSingleOrderDetails);

// accept payment
router.post("/payments", isAuth, paymentController);

// admin all get orders
router.get("/admin/get-all-orders", isAuth, isAdmin, adminAllOrders);

// Order Status Controller
router.put("/admin/order-status/:id", isAuth, isAdmin, orderStatusController);
module.exports = router;
