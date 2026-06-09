import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { runCode , submitCode } from "../controllers/judgeController.js"

const router = express.Router();

router.post("/run", authMiddleware ,runCode);
router.post("/submit", authMiddleware , submitCode);

export default router;