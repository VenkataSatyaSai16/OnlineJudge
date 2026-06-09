import express from "express";

import {getProfile , getDetails} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware ,getProfile);
router.get("/me",authMiddleware,getDetails);

export default router;