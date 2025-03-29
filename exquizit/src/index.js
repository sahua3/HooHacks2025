import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Gemini from './gemini';
import HomePage from './Homepage';
import Quiz from './Quiz';

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/gemini" element={<Gemini />} />
=======
        <Route path="quiz" element={<Quiz />} />
>>>>>>> a06c207 (quiz.js ready for backend implementation)
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
