import { askGroq } from "../services/aiReviewService.js";
import { askGroqForJson } from "../services/aiJsonService.js";
import {
  generateStudyPlanJson,
  getFallbackStudyPlanJson,
  validateStudyPlanInput,
} from "../services/studyPlannerService.js";
import {
  createMockOAWithProblems,
  generateMockOAJson,
  getFallbackMockOAJson,
  validateMockOAInput,
} from "../services/mockOAService.js";
import {
  assertAiUsageAvailable,
  incrementAiUsage,
  getAiUsage as getAiUsageService,
} from "../services/aiUsageService.js";
import { getCache, setCache } from "../services/cacheService.js";
import { analyzeComplexity, generateProblem } from "../services/aiAuthoringService.js";

export const reviewCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: "Code is required",
      });
    }

    const prompt = `You are an expert competitive programming reviewer.
Your task is to review a user's submitted solution for a coding problem.

You MUST analyze:

1. Correctness
2. Time Complexity
3. Space Complexity
4. Edge Cases
5. Code Quality
6. Possible Optimizations

Rules:

- Never rewrite the entire solution.
- Never generate a new solution.
- Never change the algorithm.
- Never explain unrelated concepts.
- Keep feedback concise and educational.
- If the solution is incorrect, explain the likely reason.
- If the solution is correct, suggest improvements only if meaningful.
- Use the provided problem statement and code only.
- Assume hidden test cases may exist.

Return ONLY valid JSON.

JSON Schema:

{
  "correctness":"Correct|Possibly Incorrect|Incorrect",
  "confidence":0,
  "timeComplexity":"",
  "spaceComplexity":"",
  "strengths":[""],
  "issues":[""],
  "edgeCases":[""],
  "optimizationSuggestions":[""],
  "summary":""
}
  
Code : ${code}`;

    const response = await askGroqForJson(prompt, (data) => {
      const requiredFields = [
        "correctness",
        "confidence",
        "timeComplexity",
        "spaceComplexity",
        "strengths",
        "issues",
        "edgeCases",
        "optimizationSuggestions",
        "summary",
      ];

      for (const field of requiredFields) {
        if (data[field] === undefined) {
          throw new Error(`AI review missing ${field}`);
        }
      }
    });

    return res.status(200).json({
      response,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || 502).json({
      message: "AI review failed",
      error: error.message,
    });
  }
};

export const generateStudyPlan = async (req, res) => {
  try {
    const validationError = validateStudyPlanInput(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    await assertAiUsageAvailable(req.user.userId, "studyPlan");
    let plan;
    let usedFallback = false;

    try {
      plan = await generateStudyPlanJson(req.body);
    } catch (error) {
      if (error.code !== "AI_INVALID_JSON") {
        throw error;
      }

      plan = getFallbackStudyPlanJson(req.body);
      usedFallback = true;
    }

    const usage = await incrementAiUsage(req.user.userId, "studyPlan");

    return res.status(200).json({
      data: plan,
      usage,
      usedFallback,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to generate study plan",
      code: error.code,
      usage: error.usage,
    });
  }
};

export const generateMockOA = async (req, res) => {
  try {
    const validationError = validateMockOAInput(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    await assertAiUsageAvailable(req.user.userId, "mockOa");
    let oaJson;
    let usedFallback = false;
    const cacheKey = `mockoa:template:${(req.body.company || "generic").toLowerCase()}:${req.body.level.toLowerCase()}:${req.body.duration}`;

    const cachedOa = await getCache(cacheKey);

    if (cachedOa) {
      oaJson = cachedOa;
    } else {
      try {
        oaJson = await generateMockOAJson(req.body);
        await setCache(cacheKey, oaJson, 7 * 24 * 60 * 60); // Cache for 7 days
      } catch (error) {
        if (error.code !== "AI_INVALID_JSON") {
          throw error;
        }

        oaJson = getFallbackMockOAJson(req.body);
        usedFallback = true;
      }
    }

    const { mockOA, problems } = await createMockOAWithProblems({
      userId: req.user.userId,
      company: req.body.company,
      level: req.body.level,
      duration: req.body.duration,
      oaJson,
    });
    const usage = await incrementAiUsage(req.user.userId, "mockOa");

    return res.status(201).json({
      message: "Mock OA generated",
      data: {
        oaId: mockOA._id,
        duration: mockOA.duration,
        company: mockOA.company,
        level: mockOA.level,
        questions: problems.map((problem) => ({
          problemId: problem._id,
          title: problem.title,
          difficulty: problem.difficulty,
          tags: problem.tags,
        })),
      },
      usage,
      usedFallback,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to generate mock OA",
      code: error.code,
      usage: error.usage,
    });
  }
};

export const analyzeProblemComplexity = async (req, res) => {
  try {
    const { problemData } = req.body;
    
    if (!problemData || !problemData.title || !problemData.description) {
      return res.status(400).json({ message: "Problem Data (Title and Description) are required." });
    }

    const usageInfo = await assertAiUsageAvailable(req.user.userId, "aiComplexity");

    const analysis = await analyzeComplexity(problemData);
    
    await incrementAiUsage(req.user.userId, "aiComplexity");

    return res.status(200).json({
      data: analysis,
    });
  } catch (error) {
    if (error.code === "AI_INVALID_JSON") {
      return res.status(502).json({
        message: error.message,
      });
    }

    if (error.statusCode === 429) {
      return res.status(429).json({
        message: error.message,
        usage: error.usage,
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred while analyzing problem complexity.",
    });
  }
};

export const generateNewProblem = async (req, res) => {
  try {
    const { topic, difficulty, companyStyle, shortDescription, similarProblem } = req.body;

    if (!topic || !difficulty || !shortDescription) {
      return res.status(400).json({ message: "Topic, Difficulty, and Short Description are required." });
    }

    const usageInfo = await assertAiUsageAvailable(req.user.userId, "aiGenerate");

    const problem = await generateProblem({ topic, difficulty, companyStyle, shortDescription, similarProblem });
    
    await incrementAiUsage(req.user.userId, "aiGenerate");

    return res.status(200).json({
      data: problem,
    });
  } catch (error) {
    if (error.code === "AI_INVALID_JSON") {
      return res.status(502).json({
        message: error.message,
      });
    }

    if (error.statusCode === 429) {
      return res.status(429).json({
        message: error.message,
        usage: error.usage,
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred while generating a problem.",
    });
  }
};

export const getAiUsage = async (req, res) => {
  try {
    const usage = await getAiUsageService(req.user.userId);
    return res.status(200).json({ data: usage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch AI usage" });
  }
};
