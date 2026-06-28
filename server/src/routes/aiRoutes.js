import express from "express";
import { generateMockOA, generateStudyPlan, reviewCode, analyzeProblemComplexity, generateNewProblem, getAiUsage } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import emailVerifiedMiddleware from "../middleware/emailVerifiedMiddleware.js";
import { mockOaLimiter, studyPlanLimiter, runLimiter, submitLimiter } from "../middleware/rateLimitMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/usage", authMiddleware, getAiUsage);

router.post("/review" , authMiddleware , reviewCode);
router.post(
  "/study-plan",
  authMiddleware,
  emailVerifiedMiddleware,
  studyPlanLimiter,
  generateStudyPlan,
);
router.post(
  "/mock-oa",
  authMiddleware,
  emailVerifiedMiddleware,
  mockOaLimiter,
  generateMockOA,
);
router.post(
  "/problem/analyze",
  authMiddleware,
  adminMiddleware,
  analyzeProblemComplexity
);
router.post(
  "/problem/generate",
  authMiddleware,
  adminMiddleware,
  generateNewProblem
);

export default router;
