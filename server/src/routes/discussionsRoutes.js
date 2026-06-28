import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import emailVerifiedMiddleware from "../middleware/emailVerifiedMiddleware.js";
import {
  addComment,
  addDiscussion,
  deleteDiscussion,
  editDiscussion,
  getComments,
  getDiscussionById,
  getDiscussions,
} from "../controllers/discussionController.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", authMiddleware, emailVerifiedMiddleware, addDiscussion);
router.get("/:id", getDiscussionById);
router.put("/:id", authMiddleware, editDiscussion);
router.delete("/:id", authMiddleware, deleteDiscussion);
router.get("/:id/comments", getComments);
router.post("/:id/comments", authMiddleware, emailVerifiedMiddleware, addComment);

export default router;
