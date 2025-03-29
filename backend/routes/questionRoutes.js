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
        choices: q.choices
      }));
      

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/check", async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    if (!questionId || !userAnswer) {
      return res.status(400).json({ error: "Missing questionId or userAnswer" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const isCorrect = question.correctAnswer === userAnswer;

    res.json({
      correct: isCorrect,
      correctAnswer: question.correctAnswer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
