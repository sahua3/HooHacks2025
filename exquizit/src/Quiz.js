import React from 'react';
import './Quiz.css';
import Button from './Button';
import QButton from './QuizButton';

function Quiz() {
  return (
    <div className="Quiz">
        <div className="App-header">
            <h1>What is my favorite Word?</h1>
            <div className="quizBody">
                <QButton btnTxt={'Meow'}/>
                <QButton btnTxt={'mew'}/>
                <QButton btnTxt={'woof'}/>
                <QButton btnTxt={'squeak'}/>
            </div>
            <div className="chatBot">
                <p>Ask me anything about the quiz!</p>
                <input type="text" placeholder="Type your question..." />
                <button>Send</button>
            </div>
        </div>
        
    </div>
  );
}

export default Quiz;
