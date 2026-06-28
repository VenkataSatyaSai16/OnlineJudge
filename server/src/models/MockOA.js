import mongoose from "mongoose";

const MockOASchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "Level must be Easy, Medium or Hard",
      },
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["generated", "started", "submitted", "expired"],
        message: "Invalid Mock OA status",
      },
      default: "generated",
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    startedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

MockOASchema.index({ user: 1, createdAt: -1 });
MockOASchema.index({ user: 1, status: 1 });

const MockOA = mongoose.model("MockOA", MockOASchema);

export default MockOA;
