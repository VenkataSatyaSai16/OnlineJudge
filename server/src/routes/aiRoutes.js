import express from "express";
import { reviewCode } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/review", authMiddleware , reviewCode);

export default router;