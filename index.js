const { getGeminiResponse } = require('./gemini');

async function main() {
    const userPrompt = "Write a short poem about the ocean";
    const response = await getGeminiResponse(userPrompt);
    
    if (response) {
        console.log("Gemini's Response:", response);
    } else {
        console.log("Failed to get a response.");
    }
}

main();