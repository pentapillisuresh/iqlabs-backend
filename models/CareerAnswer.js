const mongoose = require('mongoose');

const careerAnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerUser', required: true },
  questionId: { type: Number, required: true },   // store Q ID (1-90)
  questionText: { type: String },                 // optional, not used in PDF
  answer: { type: String, required: true }
});

module.exports = mongoose.model('CareerAnswer', careerAnswerSchema);
