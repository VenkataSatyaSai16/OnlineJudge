import createCodeFile from "../utils/createCodeFile.js";
import createInputFile from "../utils/createInputFile.js";
import executeCode from "../services/executeCode.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

export const runCode = async (req, res) => {
  try {
    const { language, code, input = "" } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        message: "Language and code are required",
      });
    }

    const { jobId, filePath } = await createCodeFile(language, code);
    const inputFilePath = await createInputFile(jobId, input);
    const output = await executeCode(language, filePath, inputFilePath, jobId);

    return res.status(200).json({
      output,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }
    let verdict = "Accepted";
    for (const testCase of problem.testCases) {
      const { jobId, filePath } = await createCodeFile(language, code);
      const inputFilePath = await createInputFile(jobId, testCase.input);
      const output = await executeCode(
        language,
        filePath,
        inputFilePath,
        jobId,
      );
      if (output.trim() !== testCase.output.trim()) {
        verdict = "Rejected";

        break;
      }
    }

    const submission = await Submission.create({
      userId: req.user.userId,
      problemId,
      language,
      code,
      verdict,
    });

    return res.status(200).json({
      verdict,
      submission,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Submission Failed",
    });
  }
};
