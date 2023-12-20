const express = require("express");
const dbConnect = require("./config/db");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const Stripe = require("stripe");
const app = express();
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const mongoSanitize = require("express-mongo-sanitize");
// PORT
const port = process.env.PORT;

// Database Connection
dbConnect();

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// stripe config
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;
// middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// security
app.use(helmet());
app.use(mongoSanitize());

// api
app.use("/api/v1/auth", require("./routes/user.route"));
app.use("/api/v1/product", require("./routes/product.route"));
app.use("/api/v1/category", require("./routes/category.route"));
app.use("/api/v1/order", require("./routes/order.route"));

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port} ${process.env.NODE_DEV} mode`
  );
});
