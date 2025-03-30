// src/ChatBot.js
import React, { useState } from 'react';
import './Quiz.css'; // Or make a separate ChatBot.css
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (!userMessage) return;

    setChatHistory(prev => [...prev, { sender: 'user', message: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3002/chat', {
        message: userMessage
      });

      const geminiResponse = response.data?.response || "Sorry, no response.";

      setChatHistory(prev => [
        ...prev,
        { sender: 'user', message: userMessage },
        { sender: 'gemini', message: geminiResponse }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', message: userMessage },
        { sender: 'gemini', message: "Sorry, there was an error." }
      ]);
    } finally {
      setLoading(false);
      setUserMessage('');
    }
  };

  return (
    <div className="chatBot">
      {chatHistory.map((chat, index) => (
        <div key={index} className={chat.sender === 'user' ? 'user-message' : 'gemini-message'}>
          <strong>{chat.sender === 'user' ? 'You' : 'Gemini'}: </strong>
          <ReactMarkdown>{chat.message}</ReactMarkdown>
        </div>
      ))}
      {loading && <div>Gemini is typing...</div>}

      <div className="input-container">
        <input
          type="text"
          value={userMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
