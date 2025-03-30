/* Make sure you type "npm install react-markdown axios" in a terminal in this folder so you don't get errors */
import React, { useState } from 'react';
import './Quiz.css';
import Button from './Button';
import QButton from './QuizButton';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import ChatBot from './chat';

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
            <ChatBot />
        </div>
    </div>
  );
}

export default Quiz;