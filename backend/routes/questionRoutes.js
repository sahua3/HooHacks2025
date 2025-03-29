import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// GET /api/questions?topic=Math&limit=5
router.get("/", async (req, res) => {
  try {
    const { topic, limit = 5 } = req.query;

    const filter = topic ? { topic: new RegExp(`^${topic}$`, "i") } : {};
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } }
    ]);

    const safeQuestions = questions.map(q => ({
        _id: q._id,
        topic: q.topic,
        questionText: q.questionText,
        choices: q.choices,
        correctAnswer: q.correctAnswer // 👈 Add this line TEMPORARILY
      }));
      

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
