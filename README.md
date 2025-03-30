# exQuizit - AI Powered Quiz App @ HooHacks 2025

exQuizit is a full-stack educational quiz platform that generates multiple-choice questions using Google Gemini. Users can receive real-time hints and explanations via a built-in chatbot, with data stored in MongoDB.

## Features

- Generate quizzes on any topic using AI
- Answer questions and receive instant feedback
- Get hints and explanations from the chatbot
- Responsive UI with clean transitions
- Backend API with question grading and AI integration

## Tech Stack

**Frontend:**
- React
- Framer Motion
- CSS Modules

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- Google Gemini API

---

## Setup Instructions

### 1. Clone the repository

    git clone https://github.com/your-username/exquizit.git
    cd exquizit

### 2. Backend Setup

Navigate to the backend folder:

    cd backend

Install dependencies:

    npm install mongoose mongodb dotenv cors express axios

Create a `.env` file in the backend folder:

    GEMINI_API_KEY=your_google_gemini_api_key

Start the backend server:

    npm start

### 3. Frontend Setup

In a separate terminal, navigate to the frontend folder:

    cd frontend

Install frontend dependencies:

    npm install framer-motion

Start the development server:

    npm run dev

---

## Usage

1. Launch both frontend and backend servers.
2. On the homepage, enter a topic and generate quiz questions.
3. Select your answers and receive feedback after each question.
4. Use the chatbot for AI-powered hints and explanations.

---

## Folder Structure

    /backend                     Express server, Gemini API, MongoDB
    /react-client-testing        React client with animations and chatbot
    /assets                      Logos and UI assets

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Google Gemini API
- HooHacks 2025 Hackathon
- MongoDB, Express, and React communities
