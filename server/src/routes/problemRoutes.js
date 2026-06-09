import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { getProblems , getProblemById , addProblem , editProblem , deleteProblem } from "../controllers/problemController.js";

const router = express.Router();

router.get("/" , getProblems);
router.get("/:id" , getProblemById);
router.post("/add" , authMiddleware , adminMiddleware , addProblem);
router.put("/:id/edit" , authMiddleware , adminMiddleware , editProblem);
router.delete("/:id/delete" , authMiddleware , adminMiddleware , deleteProblem);

export default router;
