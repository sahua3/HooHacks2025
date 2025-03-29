const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');  // Add cors to allow cross-origin requests

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());  // Enable CORS for all requests

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Function to call the Gemini API
async function getGeminiResponse(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`, 
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Gemini Response:", response.data);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        }
        return "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, there was an error while processing your request.";
    }
}

// Chat route to handle user messages
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (userMessage) {
        const geminiResponse = await getGeminiResponse(userMessage);
        if (geminiResponse) {
            res.json({ response: geminiResponse });
        } else {
            res.status(500).json({ error: "Error with Gemini response" });
        }
    } else {
        res.status(400).json({ error: "Message is required" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






