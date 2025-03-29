import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";
import sampleQuestions from "./data/questions.js"; // ✅ import question data

dotenv.config();

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Question.deleteMany(); // Optional: wipe old data
    const inserted = await Question.insertMany(sampleQuestions);
    console.log(`🌱 Seeded ${inserted.length} questions successfully`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding questions:", err.message);
    process.exit(1);
  }
};

seedQuestions();
