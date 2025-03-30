/* Make sure you type "npm install express axios dotenv cors" in a terminal in this folder so you don't get errors*/
/* ALSO make sure you have a .env file in this folder with the line "GEMINI_API_KEY=YourAPIKey" */

const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');  // Add cors to allow cross-origin requests

const app = express();
const port = process.env.PORT || 5000; //Hardcoded so that connection to front end works

app.use(express.json()); // Use express forehead
app.use(cors());  // Enable CORS for all requests

const API_KEY = process.env.GEMINI_API_KEY; // Pulls API key from .env and loads it. 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; //Don't touch, API url

// Function to call the Gemini API
async function getGeminiResponse(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`, // Sets up API 
            {
                contents: [{ parts: [{ text: "Respond to this with a max of 150 words:" + prompt }] }] // Prompt engineer so that prompts are brief
            },
            { headers: { "Content-Type": "application/json" } } // Sets API to work with JSON code
        );

        console.log("Gemini Response:", response.data); // Store response

        // If a response is pulled, return it. Otherwise display error message. 
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
    const userMessage = req.body.message; // Store user message

    // If a user sends a message, begin the whole shabang
    if (userMessage) {
        const geminiResponse = await getGeminiResponse(userMessage); // Wait for call to the API to return 
        // If a response and prompt is recieved, send to front end, if not send errors based on what happened. 
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
    console.log(`Server is running on port ${port}`); // Inform what port the server is on
});