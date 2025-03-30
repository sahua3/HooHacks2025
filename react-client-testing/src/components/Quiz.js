import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Quiz.css";
import logo from "../assets/exQuizit_logo.png";
import ChatBot from "./chat"; 
import GenerateButton from "./GenerateButton"; // AI question generator

const Quiz = ({ topic, setTopic }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");

  // Whenever `topic` changes, reload the questions
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadQuestions();
    }, 200); // adjust timing to match animation (e.g. 200ms)
  
    return () => clearTimeout(timeout);
  }, [topic]);
  

  // Fetch questions from your backend
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
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Submit entire quiz for final grading
  const handleSubmit = async () => {
    try {
      const payload = {
        userId: "test-user",
        topic,
        answers: questions.map((q) => ({
          questionId: q._id,
          userAnswer: answers[q._id] || null,
        })),
      };

      const res = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Submit single question's answer
  const handleAnswerSubmit = async () => {
    const question = questions[currentQuestionIndex];
    const userAnswer = answers[question._id];

    try {
      const res = await fetch("/api/questions/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question._id, userAnswer }),
      });

      const data = await res.json();

      setCurrentResult({
        questionId: question._id,
        userAnswer,
        correctAnswer: data.correctAnswer,
        correct: data.correct,
      });

      setShowFeedback(true);
    } catch (err) {
      console.error("Error checking answer:", err);
      alert("Couldn't check your answer.");
    }
  };

  // Move to next question, or finish if on the last question
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setAiExplanation("");
    setCurrentResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>

      {/* Chatbot pinned in bottom-right */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <ChatBot />
      </div>

      {/* Quiz content */}
      <div id="quiz-container">
        <AnimatePresence mode="wait">
          {questions.length > 0 && currentQuestion && (
            <motion.div
              key={currentQuestion._id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="quiz-container"
            >
              <div className="question-box">
                <p>
                  <strong>{currentQuestionIndex + 1}.</strong>{" "}
                  {currentQuestion.questionText}
                </p>
              </div>

              <div className="choices-grid">
                {currentQuestion.choices.map((choice) => {
                  const isSelected = answers[currentQuestion._id] === choice;
                  const isCorrect = currentResult?.correctAnswer === choice;

                  let boxClass = "choice-box";

                  if (showFeedback) {
                    if (currentResult?.correctAnswer === choice) {
                      boxClass += " correct";
                    }
                    if (
                      currentResult?.userAnswer === choice &&
                      !currentResult.correct
                    ) {
                      boxClass += " incorrect";
                    }
                  } else if (isSelected) {
                    boxClass += " selected";
                  }

                  return (
                    <div
                      key={choice}
                      className={boxClass}
                      onClick={() =>
                        !showFeedback &&
                        handleSelect(currentQuestion._id, choice)
                      }
                    >
                      {choice}
                    </div>
                  );
                })}
              </div>

              {/* Show Submit button if no feedback or final results */}
              {!showFeedback && !results && (
                <button
                  className="submit-btn"
                  onClick={handleAnswerSubmit}
                  disabled={!answers[currentQuestion._id]}
                >
                  Submit Answer
                </button>
              )}

              {/* Feedback after user submits current question */}
              {showFeedback && (
                <div className="feedback-box">
                  <button onClick={handleNextQuestion}>Next Question</button>

                  {currentResult?.correct ? (
                    <p className="correct-text">✅ Correct!</p>
                  ) : (
                    <p className="incorrect-text">
                      ❌ Incorrect. The correct answer was:{" "}
                      {currentResult?.correctAnswer}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results after final submission */}
      {results && (
        <div style={{ marginTop: "1rem" }}>
          <pre>
            Score: {results.filter((r) => r.correct).length}/{results.length}
          </pre>
          <button
            onClick={() => {
              setResults(null);
              setAnswers({});
              setCurrentQuestionIndex(0);
              setShowFeedback(false);
              setCurrentResult(null);
              setAiExplanation("");
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
