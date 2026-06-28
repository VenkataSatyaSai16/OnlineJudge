import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { runCode , submitCode } from "../controllers/judgeController.js"
import emailVerifiedMiddleware from "../middleware/emailVerifiedMiddleware.js";
import { runLimiter, submitLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/run", authMiddleware, runLimiter, runCode);
router.post("/submit", authMiddleware, emailVerifiedMiddleware, submitLimiter, submitCode);


export default router;
