import express from "express";
import { getUserSubmissions }  from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware,getUserSubmissions);
//router.get("/problem/:id",authMiddleware,getProblemSubmissions);

export default router;