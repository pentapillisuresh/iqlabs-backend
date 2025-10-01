const mongoose = require('mongoose');

const isoUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  companyName: String,
  gstNumber: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IsoUser', isoUserSchema);
