import React, { useState } from 'react';
import './Quiz.css';
import Button from './Button';
import QButton from './QuizButton';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function Quiz() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

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

        if (response.data && response.data.response) {
            // Add Gemini's response to chat history
            setChatHistory([
                ...chatHistory,
                { sender: 'user', message: userMessage },
                { sender: 'gemini', message: response.data.response }
            ]);
        } else {
            console.error('No response data received');
            setChatHistory([
                ...chatHistory,
                { sender: 'user', message: userMessage },
                { sender: 'gemini', message: "Sorry, there was an error." }
            ]);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setChatHistory([
            ...chatHistory,
            { sender: 'user', message: userMessage },
            { sender: 'gemini', message: "Sorry, there was an error." }
        ]);
    } finally {
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
            //chatbot
            <div className="chatBot">
            {chatHistory.map((chat, index) => (
          <div key={index} className={chat.sender === 'user' ? 'user-message' : 'gemini-message'}>
            <strong>{chat.sender === 'user' ? 'You' : 'Gemini'}: </strong>
            <ReactMarkdown>{chat.message}</ReactMarkdown>
          </div>
          ))}
          {loading && <div>Gemini is typing...</div>}
          //separate text input
          </div>
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
