const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
     
    });
    console.log("✅MongoDB Connected");
  } catch (error) {
    console.error("❌MongoDB connection failed:", error);
    process.exit(1);
  }
};

// MONGO_URI=mongodb://localhost:27017/TravelSafe

module.exports = connectDB;
