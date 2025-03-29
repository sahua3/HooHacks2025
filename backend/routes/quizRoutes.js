import express from "express";
import { saveQuizResult, getUserResults } from "../controllers/quizController.js";

const router = express.Router();

router.post("/grade", async (req, res) => {
    const { userId, topic, answers } = req.body;
  
    let score = 0;
    const results = [];
  
    for (const entry of answers) {
      const question = await Question.findById(entry.questionId);
      const correct = question && entry.userAnswer === question.correctAnswer;
  
      if (correct) score++;
  
      results.push({
        questionId: entry.questionId,
        question: question.questionText,
        correctAnswer: question.correctAnswer,
        userAnswer: entry.userAnswer,
        correct
      });
    }
  
    await QuizResult.create({
      userId,
      topic,
      score,
      incorrectQuestions: results.filter(r => !r.correct)
    });
  
    res.status(200).json({ score, results });
  });
  
router.get("/results/:userId", getUserResults);

export default router;
