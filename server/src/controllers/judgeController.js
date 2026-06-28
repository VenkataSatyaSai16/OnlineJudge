import createCodeFile from "../utils/createCodeFile.js";
import createInputFile from "../utils/createInputFile.js";
import executeCode from "../services/executeCode.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import MockOA from "../models/MockOA.js";
import MockOASubmission from "../models/MockOASubmission.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runCode = async (req, res) => {
  let jobId = uuidv4();
  try {
    let { language, code, input = "", problemId } = req.body;

    let timeLimit = 3000;
    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (problem && problem.timeLimit) {
        timeLimit = problem.timeLimit;
      }
    }

    if (!language || !code) {
      return res.status(400).json({
        message: "Language and code are required",
      });
    }

    const fileCreationResult = await createCodeFile(language, code, jobId);
    jobId = fileCreationResult.jobId;
    const filePath = fileCreationResult.filePath;

    if (language === "java") {
      code = code.replace(/public\s+class\s+\w+/, `public class ${jobId}`);
    }

    const inputFilePath = await createInputFile(jobId, input);
    const result = await executeCode(language, filePath, inputFilePath, jobId, timeLimit);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  } finally {
    if (jobId) {
      const sandboxDir = path.join(process.cwd(), "sandbox", jobId);
      let retries = 5;
      while (retries > 0) {
        try {
          if (fs.existsSync(sandboxDir)) {
            fs.rmSync(sandboxDir, { recursive: true, force: true });
          }
          break;
        } catch (err) {
          retries--;
          if (retries === 0) {
            console.error("Cleanup Error after retries:", err.message);
          } else {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    }
  }
};

export const submitCode = async (req, res) => {
  let jobId = uuidv4();
  try { 
    let { problemId, language, code, oaId } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    if (
      problem.visibility === "private" &&
      problem.owner?.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to submit this problem",
      });
    }

    if (
      problem.visibility === "private" &&
      oaId &&
      problem.oaId?.toString() !== oaId
    ) {
      return res.status(403).json({
        message: "Problem does not belong to this Mock OA",
      });
    }

    const mockOA = oaId ? await MockOA.findById(oaId) : null;

    if (oaId) {
      if (!mockOA || mockOA.user.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You are not allowed to submit this Mock OA problem",
        });
      }

      if (mockOA.status === "submitted" || mockOA.status === "expired") {
        return res.status(400).json({
          message: "This assessment has already ended",
        });
      }
    }

    let verdict = "Accepted";
    let passedTestCases = 0;
    const totalTestCases = problem.testCases.length;

    const fileCreationResult = await createCodeFile(language, code, jobId);
    jobId = fileCreationResult.jobId;
    const filePath = fileCreationResult.filePath;

    if (language === "java") {
      code = code.replace(/public\s+class\s+\w+/, `public class ${jobId}`);
    }

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      const inputFilePath = await createInputFile(jobId, testCase.input);
      const timeLimit = problem.timeLimit || 3000;
      const output = await executeCode(
        language,
        filePath,
        inputFilePath,
        jobId,
        timeLimit
      );
      if (output.verdict !== "Success") {
        verdict = output.verdict;
        break;
      }

      if (output.output.trim() !== testCase.output.trim()) {
        verdict = "Rejected";
        break;
      }

      passedTestCases += 1;
    }

    const submission = await Submission.create({
      userId: req.user.userId,
      problemId,
      language,
      code,
      verdict,
      oaId: oaId || problem.oaId || null,
      passedTestCases,
      totalTestCases,
    });

    if (mockOA) {
      const latestSubmissions = await Submission.find({
        userId: req.user.userId,
        oaId: mockOA._id,
      }).sort({ createdAt: -1 });

      const latestByProblem = new Map();

      for (const item of latestSubmissions) {
        const key = item.problemId.toString();
        if (!latestByProblem.has(key)) {
          latestByProblem.set(key, item);
        }
      }

      const results = mockOA.questionIds.map((questionId) => {
        const item = latestByProblem.get(questionId.toString());

        return {
          problemId: questionId,
          submissionId: item?._id || null,
          verdict: item?.verdict || "Not Attempted",
          passedTestCases: item?.passedTestCases || 0,
          totalTestCases: item?.totalTestCases || 0,
          runtime: item?.executionTime || 0,
          memory: item?.memory || 0,
        };
      });

      const questionsAttempted = results.filter(
        (result) => result.submissionId,
      ).length;
      const questionsSolved = results.filter(
        (result) => result.verdict === "Accepted",
      ).length;

      await MockOASubmission.findOneAndUpdate(
        {
          user: req.user.userId,
          oaId: mockOA._id,
        },
        {
          user: req.user.userId,
          oaId: mockOA._id,
          startedAt: mockOA.startedAt,
          duration: mockOA.duration,
          questionsAttempted,
          questionsSolved,
          results,
        },
        {
          upsert: true,
          new: true,
        },
      );
    }

    return res.status(200).json({
      verdict,
      submission,
      passedTestCases,
      totalTestCases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Submission Failed",
    });
  } finally {
    if (jobId) {
      const sandboxDir = path.join(process.cwd(), "sandbox", jobId);
      let retries = 5;
      while (retries > 0) {
        try {
          if (fs.existsSync(sandboxDir)) {
            fs.rmSync(sandboxDir, { recursive: true, force: true });
          }
          break;
        } catch (err) {
          retries--;
          if (retries === 0) {
            console.error("Cleanup Error after retries:", err.message);
          } else {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    }
  }
};
