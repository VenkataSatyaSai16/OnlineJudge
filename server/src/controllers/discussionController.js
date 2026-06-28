import Discussion from "../models/Discussions.js";
import Comment from "../models/Comments.js";
import { getCache, setCache, deleteByPrefix } from "../services/cacheService.js";

const getPagination = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const canModify = (resource, user) => {
  return (
    user?.role === "admin" ||
    resource.userId?.toString() === user?.userId
  );
};

export const getDiscussions = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const cacheKey = `discussions:page:${page}:limit:${limit}`;
    const cached = await getCache(cacheKey);
    
    if (cached) return res.status(200).json(cached);

    const [discussions, total] = await Promise.all([
      Discussion.find()
        .populate("userId", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Discussion.countDocuments(),
    ]);

    const payload = {
      data: discussions,
      pagination: buildPagination(page, limit, total),
    };

    await setCache(cacheKey, payload, 300);
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({
      message: "Discussion Fetch Error",
    });
  }
};

export const addDiscussion = async (req, res) => {
  try {
    const { discussion } = req.body;

    if (!discussion || !discussion.trim()) {
      return res.status(400).json({
        message: "Discussion is required",
      });
    }

    const discussionData = await Discussion.create({
      userId: req.user.userId,
      discussion,
    });

    await deleteByPrefix("discussions:");

    return res.status(201).json({
      message: "Added Discussion Successfully",
      data: discussionData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot Add Discussion",
    });
  }
};

export const getDiscussionById = async (req, res) => {
  try {
    const cacheKey = `discussion:${req.params.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json(cached);

    const discussion = await Discussion.findById(req.params.id).populate(
      "userId",
      "username",
    );

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    const payload = { data: discussion };
    await setCache(cacheKey, payload, 300);

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editDiscussion = async (req, res) => {
  try {
    const { discussion } = req.body;

    if (!discussion || !discussion.trim()) {
      return res.status(400).json({
        message: "Discussion is required",
      });
    }

    const existingDiscussion = await Discussion.findById(req.params.id);

    if (!existingDiscussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    if (!canModify(existingDiscussion, req.user)) {
      return res.status(403).json({
        message: "You are not allowed to edit this discussion",
      });
    }

    existingDiscussion.discussion = discussion;
    existingDiscussion.editedAt = new Date();
    await existingDiscussion.save();

    await deleteByPrefix("discussions:");
    await deleteByPrefix(`discussion:${req.params.id}`);
    await deleteByPrefix(`comments:${req.params.id}`);

    return res.status(200).json({
      message: "Discussion updated successfully",
      data: existingDiscussion,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot edit discussion",
    });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    if (!canModify(discussion, req.user)) {
      return res.status(403).json({
        message: "You are not allowed to delete this discussion",
      });
    }

    await Comment.deleteMany({ discussionId: discussion._id });
    await Discussion.findByIdAndDelete(discussion._id);

    await deleteByPrefix("discussions:");
    await deleteByPrefix(`discussion:${req.params.id}`);
    await deleteByPrefix(`comments:${req.params.id}`);

    return res.status(200).json({
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot delete discussion",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const cacheKey = `comments:${req.params.id}:page:${page}:limit:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json(cached);

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    const [comments, total] = await Promise.all([
      Comment.find({ discussionId: req.params.id })
        .populate("userId", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ discussionId: req.params.id }),
    ]);

    const payload = {
      data: comments,
      pagination: buildPagination(page, limit, total),
    };

    await setCache(cacheKey, payload, 300);
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion not found",
      });
    }

    const commentData = await Comment.create({
      discussionId: discussion._id,
      userId: req.user.userId,
      comment,
    });

    discussion.commentsCount += 1;
    await discussion.save();

    await deleteByPrefix(`discussion:${req.params.id}`);
    await deleteByPrefix(`comments:${req.params.id}`);

    return res.status(201).json({
      message: "Added successfully",
      data: commentData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!canModify(comment, req.user)) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(comment._id);
    await Discussion.findByIdAndUpdate(comment.discussionId, {
      $inc: { commentsCount: -1 },
    });

    await deleteByPrefix(`discussion:${comment.discussionId}`);
    await deleteByPrefix(`comments:${comment.discussionId}`);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
