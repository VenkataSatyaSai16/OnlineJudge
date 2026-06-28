import mongoose from "mongoose";

const MockOASubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    oaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockOA",
      required: [true, "Mock OA is required"],
    },
    startedAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    questionsSolved: {
      type: Number,
      default: 0,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    results: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        submissionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Submission",
          default: null,
        },
        verdict: {
          type: String,
          default: "Not Attempted",
        },
        passedTestCases: {
          type: Number,
          default: 0,
        },
        totalTestCases: {
          type: Number,
          default: 0,
        },
        runtime: {
          type: Number,
          default: 0,
        },
        memory: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

MockOASubmissionSchema.index({ user: 1, createdAt: -1 });
MockOASubmissionSchema.index({ oaId: 1, user: 1 });

const MockOASubmission = mongoose.model(
  "MockOASubmission",
  MockOASubmissionSchema,
);

export default MockOASubmission;
