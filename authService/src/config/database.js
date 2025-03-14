const mongoose = require("mongoose");
require("dotenv").config();

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection succesfull");
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
};

module.exports = DBconnection;
