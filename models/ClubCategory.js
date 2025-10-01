const mongoose = require("mongoose");

const clubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

module.exports = mongoose.model("ClubCategory", clubCategorySchema);
