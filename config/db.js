const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO);
    console.log(`Database connection established ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Database Connection error");
  }
};

module.exports = dbConnect;
