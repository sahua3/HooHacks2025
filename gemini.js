require('dotenv').config();
const readlineSync = require('readline-sync');  // For handling user input
const axios = require('axios');

// API setup
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


// Function to send a text prompt to the Gemini API
async function getGeminiResponse(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,  // Pass the key in the URL
            {
                contents: [{  // Expected structure for the prompt
                    parts: [{"text": prompt}]
                }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Now, extract the content from the correct field
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const content = response.data.candidates[0].content;
            if (content && content.parts && content.parts.length > 0) {
                return content.parts[0].text; // Extracting the text from the first part
            }
        }

        return "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        return "Sorry, I encountered an error while processing your request.";
    }
}

// Main chatbot loop
async function startChat() {
    console.log("Hello! I'm your chatbot. Type 'exit' to end the conversation.");

    while (true) {
        const userInput = readlineSync.question("You: ");

        // Exit condition
        if (userInput.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            break;
        }

        const response = await getGeminiResponse(userInput);
        console.log("Gemini: " + response);
    }
}

// Start the chatbot
startChat();



