// GenerateButton.js
import React from "react";

const GenerateButton = ({ onGenerateComplete }) => {
  const generateQuestions = async () => {
    const topic = prompt("Enter a topic for the quiz:");
    if (!topic) return;

    const res = await fetch("/api/questions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    // After the backend adds new questions, let's reload them in the quiz
    if (onGenerateComplete) {
      onGenerateComplete(topic);
    }

    alert(`✅ Added ${data.inserted.length} questions for topic: ${topic}`);
  };

  return <button onClick={generateQuestions}>Generate Questions (AI)</button>;
};

export default GenerateButton;
