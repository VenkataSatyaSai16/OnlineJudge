import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import emailVerifiedMiddleware from "../middleware/emailVerifiedMiddleware.js";
import {
  getMockOAById,
  getMockOAProblems,
  getMockOAResult,
  getUserMockOAs,
  startMockOA,
  submitMockOA,
} from "../controllers/mockOAController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserMockOAs);
router.get("/:oaId", authMiddleware, getMockOAById);
router.post("/:oaId/start", authMiddleware, startMockOA);
router.get("/:oaId/problems", authMiddleware, getMockOAProblems);
router.post("/:oaId/submit", authMiddleware, emailVerifiedMiddleware, submitMockOA);
router.get("/:oaId/result", authMiddleware, getMockOAResult);

export default router;
