import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: String
  },  
  topic: String,
  score: Number,
  incorrectQuestions: [
    {
      question: String,
      correctAnswer: String,
      userAnswer: String,
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("QuizResult", quizResultSchema);
