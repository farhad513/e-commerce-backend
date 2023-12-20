const {
  registerController,
  loginController,
  getUserProfileController,
  logoutControler,
  updateProfile,
  updatePassword,
  updateImage,
  forgotPasswordController,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/isAuth");
const singleUpload = require("../middlewares/multer");
const router = require("express").Router();
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

// regiter route  || POST
router.post("/register", limiter, registerController);

// login || POST
router.post("/login", limiter, loginController);

// profile
router.get("/profile", isAuth, getUserProfileController);
// profile updte
router.put("/update-profile", isAuth, updateProfile);
// udpate passwprd
router.put("/update-password", isAuth, updatePassword);
// udpate Image
router.put("/update-image", isAuth, singleUpload, updateImage);
// logout
router.get("/logout", isAuth, logoutControler);

// forgot password
router.post("/forgot-password", forgotPasswordController);

module.exports = router;
