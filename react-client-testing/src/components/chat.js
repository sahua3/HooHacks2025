import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './chat.css';
import axios from 'axios';

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // 👈 Set to false initially
  useEffect(() => {
    // Add a welcome message from Gemini on first load
    setChatHistory([
      {
        sender: 'gemini',
        message: "Hi there! I'm your quiz assistant. Ask me anything about the current question or topic! If you need a hint, just type hint"
      }
    ]);
  }, []);
  
  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (!userMessage) return;

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
    <div className={`chatBot-wrapper ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        💬 Chat {isOpen ? '▾' : '▸'}
      </div>

      {isOpen && (
        <div className="chatBot">
          <div className="chatBot-messages">
            {chatHistory.map((chat, index) => (
              <div key={index} className={chat.sender === 'user' ? 'user-message' : 'gemini-message'}>
                <strong>{chat.sender === 'user' ? 'You' : 'Gemini'}: </strong>
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              </div>
            ))}
            {loading && <div>Gemini is typing...</div>}
          </div>

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
      )}
    </div>
  );
};

export default ChatBot;
