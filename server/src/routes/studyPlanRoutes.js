import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getStudyPlans, saveStudyPlan, updateStudyPlanDay, deleteStudyPlan } from "../controllers/studyPlanController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getStudyPlans);
router.post("/", saveStudyPlan);
router.put("/:id/complete", updateStudyPlanDay);
router.delete("/:id", deleteStudyPlan);

export default router;
