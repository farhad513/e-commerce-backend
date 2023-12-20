const { User } = require("../models/user.model");
const getDataUri = require("../utils/feature");
const cloudinary = require("cloudinary").v2;

// register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, city, country, answer } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !phone ||
      !city ||
      !country ||
      !answer
    ) {
      res.status(500).send({
        success: false,
        message: "Please enter all required fields",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(500).send({
        success: false,
        message: "Email already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      address,
      phone,
      country,
      city,
      answer,
    });
    res.status(200).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Regiter Error",
      error,
    });
  }
};

// login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please enter your email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // password matched
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Email and Password is not correct",
      });
    }
    user.password = undefined;
    // create token
    const token = await user.createToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_DEV === "development" ? true : false,
        httpOnly: process.env.NODE_DEV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "login successful",
        user,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login Contrller error",
      error,
    });
  }
};

// get user profile controller
const getUserProfileController = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id });
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Profile Contrller error",
      error,
    });
  }
};
// update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, address, phone, city, country } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (country) user.country = country;
    // save User
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Update Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "update Profile Contrller error",
      error,
    });
  }
};
// update password
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        message: "Please enter old and new password",
      });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid Old and New Password",
      });
    }
    user.password = newPassword;
    console.log(user.password);

    await user.save();
    console.log(user.password);
    res.status(200).send({
      success: true,
      message: "User Password Update Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "update Password Contrller error",
      error,
    });
  }
};

// update Image
const updateImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const file = getDataUri(req.file);

    await cloudinary.uploader.destroy(user.image.public_id);
    const updateImage = await cloudinary.uploader.upload(file.content);
    user.image = {
      public_id: updateImage.public_id,
      url: updateImage.secure_url,
    };
    // save
    await user.save();
    res.status(200).send({
      success: true,
      message: "Image Update Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update Image Controller Error",
      error,
    });
  }
};
// logout controller
const logoutControler = async (req, res) => {
  try {
    res
      .status(201)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_DEV === "development" ? true : false,
        httpOnly: process.env.NODE_DEV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logout successful",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "User Logout Contrller error",
      error,
    });
  }
};

// forgot Password
const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: true,
        message: "Please Provide all fields",
      });
    }
    // find user
    const user = await User.findOne({ email, answer });
    if (!user || !answer) {
      return res.status(500).send({
        success: false,
        message: "Invalid User and Answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password has been reset please login",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Forgot Password Contrller error",
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  getUserProfileController,
  logoutControler,
  updateProfile,
  updatePassword,
  forgotPasswordController,
  updateImage,
};
