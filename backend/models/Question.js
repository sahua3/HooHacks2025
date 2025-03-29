import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questionText: { type: String, required: true },
  choices: {
    type: [String],
    validate: [array => array.length >= 2, 'At least two choices required']
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

export default mongoose.model("Question", questionSchema);
