// App.js
import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function App() {
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
    <div className="App">
      <div className="chat-box">
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
  );
}

export default App;

