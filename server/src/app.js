//libraries and Routes 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js"
import aiRoutes from "./routes/aiRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import discusssionRoutes from "./routes/discussionsRoutes.js"
import commentRoutes from "./routes/commentRoutes.js";
import mockOARoutes from "./routes/mockOARoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

//Middleware 
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routing
app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/problems",problemRoutes);
app.use("/api/judge",judgeRoutes);
app.use("/api/submission",submissionRoutes);
app.use("/api/leaderboard",leaderboardRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/discussions",discusssionRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/mock-oa",mockOARoutes);
app.use("/api/study-plans",studyPlanRoutes);

// Example: Basic Express error handler to help debug
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});


export default app;
