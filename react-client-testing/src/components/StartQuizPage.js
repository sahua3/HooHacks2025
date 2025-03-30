import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartQuizPage.css";

const StartQuizPage = ({ setTopic }) => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

// Function to handle the start quiz button click
  const handleStartQuiz = () => {
    if (selectedTopic) {
      setTopic(selectedTopic);
      navigate("/quiz");
    }
  };

  return (
    <div className="start-container">
      <h1>Select a Topic</h1>

        // display the topic buttons
      <div className="topic-buttons">
        {["Math", "Science", "History"].map((topic) => (
          <button
            key={topic}
            className={`topic-btn ${selectedTopic === topic ? "active" : ""}`}
            onClick={() => handleTopicSelect(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      // start quiz
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
