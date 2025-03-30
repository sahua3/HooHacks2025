import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartQuizPage.css";
import logo from "../assets/exQuizit_logo.png";
import bg from '../assets/exQuizit_bg.png';

const StartQuizPage = ({ setTopic }) => {
  const navigate = useNavigate();
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!customTopic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: customTopic.trim() })
      });

      const data = await res.json();

      if (res.ok && data.inserted.length > 0) {
        setTopic(customTopic.trim());
        navigate("/quiz");
      } else {
        setError("Failed to generate questions.");
      }
    } catch (err) {
      setError("Error contacting AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-container" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
      <img src={logo} alt="exQuizit logo" className="logo" />

      <p className="how-it-works">
        exQuizit generates 5 custom multiple-choice questions for any topic you type using AI 🤖
      </p>

      <p className="suggestion-text">
        Try something like: <em>Physics, Cybersecurity, Algebra, or Psychology</em>
      </p>

      <input
        type="text"
        className="topic-input"
        value={customTopic}
        onChange={(e) => setCustomTopic(e.target.value)}
        placeholder="Enter a topic..."
      />

      {error && <p className="error">{error}</p>}

      <button
        className="start-quiz-btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      <p className="fun-fact">🔥 Over 100 AI-generated questions and counting!</p>
    </div>
  );
};

export default StartQuizPage;
