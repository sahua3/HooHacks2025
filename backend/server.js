import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => res.send("exQuizit backend is live!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
