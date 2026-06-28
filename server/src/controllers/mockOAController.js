import MockOA from "../models/MockOA.js";
import MockOASubmission from "../models/MockOASubmission.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

const ensureOwner = (mockOA, req) => {
  return mockOA.user?.toString() === req.user.userId || req.user.role === "admin";
};

const getProgress = async (mockOA, userId) => {
  const submissions = await Submission.find({
    userId,
    oaId: mockOA._id,
  }).sort({ createdAt: -1 });

  const latestByProblem = new Map();

  for (const submission of submissions) {
    const key = submission.problemId.toString();
    if (!latestByProblem.has(key)) {
      latestByProblem.set(key, submission);
    }
  }

  const results = mockOA.questionIds.map((problemId) => {
    const id = problemId._id || problemId;
    const submission = latestByProblem.get(id.toString());

    return {
      problemId: id,
      submissionId: submission?._id || null,
      verdict: submission?.verdict || "Not Attempted",
      passedTestCases: submission?.passedTestCases || 0,
      totalTestCases: submission?.totalTestCases || 0,
    };
  });

  return {
    results,
    questionsAttempted: results.filter((result) => result.submissionId).length,
    questionsSolved: results.filter((result) => result.verdict === "Accepted").length,
  };
};

export const getUserMockOAs = async (req, res) => {
  try {
    const mockOAs = await MockOA.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("questionIds", "title difficulty tags");

    return res.status(200).json({
      data: mockOAs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch Mock OAs",
    });
  }
};

export const getMockOAById = async (req, res) => {
  try {
    const mockOA = await MockOA.findById(req.params.oaId).populate(
      "questionIds",
      "_id",
    );

    if (!mockOA) {
      return res.status(404).json({
        message: "Mock OA not found",
      });
    }

    if (!ensureOwner(mockOA, req)) {
      return res.status(403).json({
        message: "You are not allowed to access this Mock OA",
      });
    }

    const progress = await getProgress(mockOA, req.user.userId);

    return res.status(200).json({
      data: {
        ...mockOA.toObject(),
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch Mock OA",
    });
  }
};

export const startMockOA = async (req, res) => {
  try {
    const mockOA = await MockOA.findById(req.params.oaId);

    if (!mockOA) {
      return res.status(404).json({
        message: "Mock OA not found",
      });
    }

    if (!ensureOwner(mockOA, req)) {
      return res.status(403).json({
        message: "You are not allowed to start this Mock OA",
      });
    }

    if (!mockOA.startedAt) {
      mockOA.startedAt = new Date();
      mockOA.expiresAt = new Date(Date.now() + mockOA.duration * 60 * 1000);
      mockOA.status = "started";
      await mockOA.save();
    }

    if (mockOA.expiresAt && mockOA.expiresAt.getTime() <= Date.now() && mockOA.status === "started") {
      mockOA.status = "expired";
      await mockOA.save();
    }

    return res.status(200).json({
      message: "Mock OA started",
      data: mockOA,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to start Mock OA",
    });
  }
};

export const getMockOAProblems = async (req, res) => {
  try {
    const mockOA = await MockOA.findById(req.params.oaId);

    if (!mockOA) {
      return res.status(404).json({
        message: "Mock OA not found",
      });
    }

    if (!ensureOwner(mockOA, req)) {
      return res.status(403).json({
        message: "You are not allowed to access this Mock OA",
      });
    }

    const problems = await Problem.find({
      owner: req.user.userId,
      oaId: mockOA._id,
      source: "mockoa",
      visibility: "private",
    }).select("-hiddenTestCases -testCases");

    return res.status(200).json({
      data: problems,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch Mock OA problems",
    });
  }
};

export const submitMockOA = async (req, res) => {
  try {
    const mockOA = await MockOA.findById(req.params.oaId);

    if (!mockOA) {
      return res.status(404).json({
        message: "Mock OA not found",
      });
    }

    if (!ensureOwner(mockOA, req)) {
      return res.status(403).json({
        message: "You are not allowed to submit this Mock OA",
      });
    }

    const progress = await getProgress(mockOA, req.user.userId);
    const results = progress.results;

    const questionsAttempted = progress.questionsAttempted;
    const questionsSolved = progress.questionsSolved;
    const score = mockOA.questionIds.length
      ? Number(((questionsSolved / mockOA.questionIds.length) * 100).toFixed(2))
      : 0;

    mockOA.status = mockOA.expiresAt && mockOA.expiresAt.getTime() <= Date.now() ? "expired" : "submitted";
    mockOA.submittedAt = new Date();
    await mockOA.save();

    const mockOASubmission = await MockOASubmission.findOneAndUpdate(
      {
        user: req.user.userId,
        oaId: mockOA._id,
      },
      {
        user: req.user.userId,
        oaId: mockOA._id,
        startedAt: mockOA.startedAt,
        submittedAt: mockOA.submittedAt,
        duration: mockOA.duration,
        score,
        questionsSolved,
        questionsAttempted,
        results,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      message: "Mock OA submitted",
      data: mockOASubmission,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to submit Mock OA",
    });
  }
};

export const getMockOAResult = async (req, res) => {
  try {
    const result = await MockOASubmission.findOne({
      user: req.user.userId,
      oaId: req.params.oaId,
    }).populate("results.problemId", "title difficulty tags");

    if (!result) {
      return res.status(404).json({
        message: "Mock OA result not found",
      });
    }

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch Mock OA result",
    });
  }
};
