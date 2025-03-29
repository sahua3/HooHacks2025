import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const sampleQuestions = [
  {
    topic: "Math",
    questionText: "What is 6 x 7?",
    choices: ["42", "36", "48", "40"],
    correctAnswer: "42"
  },
  {
    topic: "Science",
    questionText: "What planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars"
  },
  {
    topic: "History",
    questionText: "Who was the first President of the United States?",
    choices: ["Abraham Lincoln", "George Washington", "John Adams", "Thomas Jefferson"],
    correctAnswer: "George Washington"
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Question.deleteMany(); // Optional: Clear existing questions
    const inserted = await Question.insertMany(sampleQuestions);
    console.log("🌱 Seeded questions:", inserted);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding questions:", err.message);
    process.exit(1);
  }
};

seedQuestions();
