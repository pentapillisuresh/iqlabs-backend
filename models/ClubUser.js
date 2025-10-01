const mongoose = require("mongoose");

const clubUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ClubCategory", required: true },
  subfield: { type: mongoose.Schema.Types.ObjectId, ref: "ClubSubfield", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClubUser", clubUserSchema);
