const mongoose = require('mongoose');

const careerUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CareerUser', careerUserSchema);
