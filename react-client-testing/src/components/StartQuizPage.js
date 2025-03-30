import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartQuizPage.css";
import logo from '../assets/exQuizit_logo.png';

const StartQuizPage = ({ setTopic }) => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleStartQuiz = () => {
    if (selectedTopic) {
      setTopic(selectedTopic);
      navigate("/quiz");
    }
  };

  return (
    <div className="start-container">
      <div className="logo-container">
        <img src={logo} alt="logo"/>
      </div> 
      <h1 className="start-title">Select a Topic</h1>

        {/* Topic Selection Buttons */}
        <div className="topic-buttons">
          {["Math", "Science", "History", "Geography", "Literature", "Art", "Technology", "Sports", "Music"].map((topic) => (
            <button
          key={topic}
          className={`topic-btn ${selectedTopic === topic ? "active" : ""}`}
          onClick={() => handleTopicSelect(topic)}
            >
          {topic}
            </button>
          ))}
        </div>

        {/* Start Quiz Button */}
      <div className="start-button-container">
        <button
          className="start-quiz-btn"
          onClick={handleStartQuiz}
          disabled={!selectedTopic}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default StartQuizPage;
