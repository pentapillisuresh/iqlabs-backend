import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  answer: { type: String, required: true }
});

const counselingResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerUser" },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CounselingResponse", counselingResponseSchema);
