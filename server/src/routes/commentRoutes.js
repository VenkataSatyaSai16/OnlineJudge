import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { deleteComment } from "../controllers/discussionController.js";

const router = express.Router();

router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
