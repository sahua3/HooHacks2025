import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './chat.css';
import axios from 'axios';

const ChatBot = ({ externalPrompt, openOnPrompt = false }) => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, chatHistory]);

  // On mount, add welcome message
  useEffect(() => {
    setChatHistory([
      {
        sender: 'gemini',
        message: "Hi there! I'm your quiz assistant. Ask me anything about the current question or topic!"
      }
    ]);
  }, []);

  // When an external prompt is passed in, send it to Gemini and display it
  useEffect(() => {
    const sendExternalPrompt = async () => {
      if (!externalPrompt) return;
  
      setIsOpen(true);
      setLoading(true);
  
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', message: externalPrompt }
      ]);
  
      try {
        const response = await axios.post('http://localhost:3002/chat', {
          message: externalPrompt
        });
  
        const geminiResponse = response.data?.response || "Sorry, no response.";
  
        setChatHistory(prev => [
          ...prev,
          { sender: 'gemini', message: geminiResponse }
        ]);
      } catch (error) {
        console.error('Error sending external prompt:', error);
        setChatHistory(prev => [
          ...prev,
          { sender: 'gemini', message: "Sorry, there was an error." }
        ]);
      } finally {
        setLoading(false);
      }
    };
  
    sendExternalPrompt();
  }, [externalPrompt, openOnPrompt]);  

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const sendMessage = async (message) => {
    if (!message) return;
  
    setIsOpen(true);
    setLoading(true);
  
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', message }
    ]);
  
    try {
      const response = await axios.post('http://localhost:3002/chat', {
        message
      });
  
      const geminiResponse = response.data?.response || "Sorry, no response.";
  
      setChatHistory(prev => [
        ...prev,
        { sender: 'gemini', message: geminiResponse }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [
        ...prev,
        { sender: 'gemini', message: "Sorry, there was an error." }
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="chatBot-wrapper">
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        💬 Chat {isOpen ? '▾' : '▸'}
      </div>

      {/* Animated messages */}
      <div className={`chatBot-messages-container ${isOpen ? 'open' : ''}`}>
        <div className="chatBot-messages">
          {chatHistory.map((chat, index) => (
            <div key={index} className={chat.sender === 'user' ? 'user-message' : 'gemini-message'}>
              <strong>{chat.sender === 'user' ? 'You' : 'Gemini'}: </strong>
              <ReactMarkdown>{chat.message}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Always-visible input */}
      <div className="input-container">
      <input
        type="text"
        value={userMessage}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const messageToSend = userMessage; // snapshot to avoid race condition
            setUserMessage(''); // clear input right away
            sendMessage(messageToSend);
          }
        }}
        placeholder="Type your message..."
      />
        <button onClick={() => {
          const msg = userMessage;
          setUserMessage('');
          sendMessage(msg);
        }}>
          Send
        </button>

      </div>
    </div>
  );
};

export default ChatBot;
export { ChatBot };