const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true }, // Remove default
});

const Route = mongoose.model("Route", RouteSchema);
module.exports = Route;
