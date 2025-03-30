/* Make sure you type "npm install react-markdown axios" in a terminal in this folder so you don't get errors */
import React, { useState } from 'react';
import './Quiz.css';
import Button from './Button';
import QButton from './QuizButton';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function Quiz() {

  // This part sets up the variables and functions for interacting with the chatbot. Do not touch!
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen for user input and store the message 
  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  // Send the message to Gemini 
  const sendMessage = async () => {
    if (!userMessage) return;

    // Add user's message to chat history
    setChatHistory([...chatHistory, { sender: 'user', message: userMessage }]);
    setLoading(true);

    try {
        // Send the message to the backend
        const response = await axios.post('http://localhost:5000/chat', {
            message: userMessage
        });

        console.log('Backend Response:', response.data);  // Log the response from the backend

        if (response.data && response.data.response) { // Check if Gemini has responded
            setChatHistory([
                ...chatHistory,
                { sender: 'user', message: userMessage }, // Add user message to chat history
                { sender: 'gemini', message: response.data.response } // Add gemini response to chat history
            ]);
        } else {
          // Catch if there is an error in getting a response from Gemini
            console.error('No response data received');
            setChatHistory([
                ...chatHistory,
                { sender: 'user', message: userMessage },
                { sender: 'gemini', message: "Sorry, there was an error." }
            ]);
        }
    } catch (error) {
        // Catch if there is an error sending the user's message to the backend
        console.error('Error sending message:', error);
        setChatHistory([
            ...chatHistory,
            { sender: 'user', message: userMessage },
            { sender: 'gemini', message: "Sorry, there was an error." }
        ]);
    } finally {
      // Reset for next prompt
        setLoading(false);
        setUserMessage('');
    }
};
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

            {/* Div for ChatBot */}
            <div className="chatBot">
            {chatHistory.map((chat, index) => (
          <div key={index} className={chat.sender === 'user' ? 'user-message' : 'gemini-message'}>
            <strong>{chat.sender === 'user' ? 'You' : 'Gemini'}: </strong>
            <ReactMarkdown>{chat.message}</ReactMarkdown> {/* Formats response in Markdown*/}
          </div>
          ))}
          {/* Can be changed to anything, displays when waiting for Gemini to respond*/}
          {loading && <div>Gemini is typing...</div>} 
          </div>

            {/* Div for user input box */}
            <div className="input-container">
          < input
              type="text"
              value={userMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            </div>

        </div>
    </div>
  );
}

export default Quiz;
