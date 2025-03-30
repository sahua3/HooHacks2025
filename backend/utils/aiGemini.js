// backend/utils/aiGemini.js
import axios from "axios";
import geminiClient from "../config/geminiClient.js"; // adjust path as needed


export const generateQuestionsFromAI = async (topic) => {
  const prompt = `
  You are an API. Generate 5 multiple-choice quiz questions on the topic "${topic}". 
  Each item should be an object like this:

  {
    "questionText": "...",
    "choices": ["...", "...", "...", "..."],
    "correctAnswer": "..."
  }

  ❗ Output ONLY a raw JSON array. Do NOT use markdown or explanation.
  `;

  const geminiResponse = await geminiClient.send(prompt);
  let rawText = geminiResponse.response || "";

  // Strip markdown formatting if present
  if (rawText.startsWith("```json")) rawText = rawText.replace(/^```json/, "").trim();
  if (rawText.endsWith("```")) rawText = rawText.replace(/```$/, "").trim();

  try {
    const parsed = JSON.parse(rawText);

    // ✅ Add topic to each question
    const questionsWithTopic = parsed.map(q => ({ ...q, topic }));

    return questionsWithTopic;
  } catch (err) {
    console.error("❌ Failed to parse Gemini response:", rawText);
    throw err;
  }
};
