import QuizResult from "../models/QuizResult.js";

// Save a new quiz result
export const saveQuizResult = async (req, res) => {
  try {
    const result = new QuizResult(req.body);
    await result.save();
    res.status(201).json({ message: "Quiz result saved", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get results for a specific user
export const getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
