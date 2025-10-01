const mongoose = require("mongoose");

const clubSubfieldSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ClubCategory", required: true },
  name: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, default: 0 },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClubSubfield", clubSubfieldSchema);
