const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

// User Auth
const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized user",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
};

// Admin Auth
const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(404).send({
      success: false,
      message: " Admin Only Access",
    });
  }
  next();
};

module.exports = { isAuth, isAdmin };
