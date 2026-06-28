import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    discussionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      required: [true, "Discussion is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

CommentSchema.index({ discussionId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
