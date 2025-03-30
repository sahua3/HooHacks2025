import React, { useState, useEffect } from "react";
import "./Quiz.css";

const Quiz = ({ topic }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");

  useEffect(() => {
    loadQuestions();
  }, [topic]);

  const loadQuestions = async () => {
    try {
      const res = await fetch(`/api/questions?topic=${topic}&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
      setAnswers({});
      setResults(null);
      setCurrentQuestionIndex(0);
      setShowFeedback(false);
      setCurrentResult(null);
      setAiExplanation("");
    } catch (err) {
      console.error("Error loading questions:", err);
      alert("Failed to load questions. Is the backend running?");
    }
  };

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        userId: "test-user",
        topic,
        answers: questions.map(q => ({
          questionId: q._id,
          userAnswer: answers[q._id] || null
        }))
      };

      const res = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setTimeout(() => {
        setResults(result.results);
      }, 400);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Check the backend.");
    }
  };

  const handleAnswerSubmit = async () => {
    const question = questions[currentQuestionIndex];
    const userAnswer = answers[question._id];

    try {
      const res = await fetch("/api/questions/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question._id, userAnswer })
      });

      const data = await res.json();

      setCurrentResult({
        questionId: question._id,
        userAnswer,
        correctAnswer: data.correctAnswer,
        correct: data.correct
      });

      setShowFeedback(true);
    } catch (err) {
      console.error("Error checking answer:", err);
      alert("Couldn't check your answer.");
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setAiExplanation("");
    setCurrentResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      handleSubmit();
    }
  };

  const explainWithAI = async () => {
    const questionText = questions[currentQuestionIndex].questionText;
    const correctAnswer = currentResult?.correctAnswer;
    const userAnswer = currentResult?.userAnswer;

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, correctAnswer, userAnswer })
      });

      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      setAiExplanation("Sorry, AI couldn't generate an explanation.");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>exQuizit: Take a Quiz</h2>

      {/* Display the topic and question number */}
      <div id="quiz-container">
        {questions.length > 0 && currentQuestion && (
          <div className="quiz-container">
            {/* Display the question number and text */}
            <div className="question-box">
              <p><strong>{currentQuestionIndex + 1}.</strong> {currentQuestion.questionText}</p>
            </div>

            {/* Display the choices in a grid layout */}
            <div className="choices-grid">
              {currentQuestion.choices.map(choice => {
                const isSelected = answers[currentQuestion._id] === choice;
                const isCorrect = currentResult?.correctAnswer === choice;

                let boxClass = "choice-box";

                if (showFeedback) {
                  if (isCorrect) boxClass += " correct";
                  if (currentResult?.userAnswer === choice && !currentResult.correct) boxClass += " incorrect";
                } else if (isSelected) {
                  boxClass += " selected";
                }

                return (
                  <div
                    key={choice}
                    className={boxClass}
                    onClick={() => !showFeedback && handleSelect(currentQuestion._id, choice)}
                  >
                    {choice}
                  </div>
                );
              })}
            </div>

            {/* Submit button */}
            {!showFeedback && !results && (
              <button
                onClick={handleAnswerSubmit}
                disabled={!answers[currentQuestion._id]}
              >
                Submit Answer
              </button>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className="feedback-box">
                {currentResult?.correct ? (
                  <p className="correct-text">✅ Correct!</p>
                ) : (
                  <p className="incorrect-text">❌ Incorrect. The correct answer was: {currentResult?.correctAnswer}</p>
                )}

                <button onClick={handleNextQuestion}>Next Question</button>

                {/* Why? button */}
                {!currentResult?.correct && (
                  <button onClick={explainWithAI}>Why?</button>
                )}

                {/* AI explanation */}
                {aiExplanation && (
                  <div className="ai-explanation">
                    <p><strong>AI says:</strong> {aiExplanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Final results */}
      {results && (
        <div style={{ marginTop: "1rem" }}>
          <pre>
            Score: {results.filter(r => r.correct).length}/{results.length}
          </pre>
          <button onClick={() => {
            setResults(null);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setShowFeedback(false);
            setCurrentResult(null);
            setAiExplanation("");
          }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
