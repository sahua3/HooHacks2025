import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import StartQuizPage from "./components/StartQuizPage";
import Quiz from "./components/Quiz";

function App() {
  const [topic, setTopic] = useState("Math");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartQuizPage setTopic={setTopic} />} />
        <Route path="/quiz" element={<Quiz topic={topic} setTopic={setTopic} />} />

      </Routes>
    </Router>
  );
}

export default App;
