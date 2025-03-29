import express from "express";
import { saveQuizResult, getUserResults } from "../controllers/quizController.js";

const router = express.Router();

router.post("/submit", saveQuizResult);
router.get("/results/:userId", getUserResults);

export default router;
