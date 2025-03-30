import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Quiz.css';
import QButton from './QuizButton';

const Quiz = ({ topic }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetch(`/api/questions?topic=${topic}&limit=5`)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, [topic]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (choice) => {
    setAnswers(prev => ({ ...prev, [currentQuestion._id]: choice }));
    // mock feedback
    setShowFeedback(true);
    setCurrentResult({
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: choice,
      correct: choice === currentQuestion.correctAnswer
    });
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    }
  };

  const handleAI = async () => {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: currentQuestion.questionText,
        correctAnswer: currentResult.correctAnswer,
        userAnswer: currentResult.userAnswer
      })
    });
    const data = await res.json();
    setAiExplanation(data.explanation);
  };

  return (
    <div className="Quiz">
      <div className="App-header">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="quizBody"
            >
              <h1>{currentQuestion.questionText}</h1>
              {currentQuestion.choices.map((choice, i) => (
                <QButton
                  key={i}
                  btnTxt={choice}
                  onClick={() => !showFeedback && handleAnswer(choice)}
                  className={showFeedback
                    ? choice === currentResult?.correctAnswer
                      ? 'correct'
                      : choice === currentResult?.userAnswer
                      ? 'incorrect'
                      : ''
                    : ''}
                />
              ))}
              {showFeedback && (
                <div>
                  <p>{currentResult.correct ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${currentResult.correctAnswer}`}</p>
                  <button onClick={handleNext}>Next</button>
                  {!currentResult.correct && <button onClick={handleAI}>Why?</button>}
                  {aiExplanation && <p><strong>AI:</strong> {aiExplanation}</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="chatBot">
          <p>Ask me anything about the quiz!</p>
          <input
            type="text"
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAI}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
