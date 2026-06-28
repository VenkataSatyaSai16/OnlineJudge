import mongoose from "mongoose";
import MockOA from "../models/MockOA.js";
import Problem from "../models/Problem.js";
import { askGroqForJson } from "./aiJsonService.js";

const normalizeDifficulty = (difficulty, fallback) => {
  if (["Easy", "Medium", "Hard"].includes(difficulty)) return difficulty;
  return fallback;
};

export const validateMockOAInput = ({ level, duration }) => {
  if (!["Easy", "Medium", "Hard"].includes(level)) {
    return "Level must be Easy, Medium or Hard";
  }

  if (!duration || Number(duration) < 30 || Number(duration) > 240) {
    return "Duration must be between 30 and 240 minutes";
  }

  return null;
};

const validateMockOAResponse = (data) => {
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("Mock OA must include questions");
  }

  for (const question of data.questions) {
    const required = [
      "title",
      "description",
      "difficulty",
      "constraints",
      "examples",
      "testCases",
      "timeLimit",
      "memoryLimit",
      "tags",
      "functionSignature",
    ];

    for (const field of required) {
      if (question[field] === undefined || question[field] === null) {
        throw new Error(`Question is missing ${field}`);
      }
    }

    if (!Array.isArray(question.testCases)) {
      throw new Error("Question test cases must be an array");
    }
  }
};

export const generateMockOAJson = async ({ company = "", level, duration }) => {
  const prompt = `You are an expert online assessment problem setter.

Return ONLY valid JSON. Do not include markdown, explanations, comments, or extra text.

Generate an original mock online assessment.

Inputs:
company: "${company || "generic"}"
level: "${level}"
duration: ${Number(duration)} minutes

If company is provided, create problems inspired by common public interview patterns for that company, but DO NOT copy real interview questions.

The response must match:
{
  "title": "string",
  "company": "string",
  "level": "Easy|Medium|Hard",
  "duration": number,
  "questions": [
    {
      "title": "string",
      "description": "string",
      "difficulty": "Easy|Medium|Hard",
      "inputFormat": "string",
      "outputFormat": "string",
      "constraints": "string",
      "timeLimit": 2000,
      "memoryLimit": 256,
      "tags": ["Sliding Window"],
      "functionSignature": "string",
      "examples": [
        {
          "input": "string",
          "output": "string",
          "explanation": "string"
        }
      ],
      "testCases": [
        {
          "input": "string",
          "output": "string",
          "isHidden": false
        },
        {
          "input": "string",
          "output": "string",
          "isHidden": true,
          "category": "normal|boundary|edge|performance|corner"
        }
      ]
    }
  ]
}

Rules:
- Generate exactly 3 questions for 90 minutes, 2 for under 60 minutes, and 4 for over 120 minutes.
- All questions must be original.
- Inputs and outputs must be compatible with stdin/stdout judging.
- Use plain ASCII characters only.
- Do not include self-corrections, uncertainty, or commentary inside explanations.
- Every example output must be mathematically correct for its input.
- Every test case object must have exactly "input" and "output" string fields, plus "isHidden".
- Do not put escaped quotes around JSON keys inside nested objects.
- Return JSON only.

Test Case Requirements (CRITICAL):
For EVERY generated problem, generate 10-12 hidden test cases (isHidden: true). Do NOT generate only random inputs.
The test cases must intentionally cover edge cases, boundary cases, and performance cases (large inputs).
- Sample Test Cases (isHidden: false): Exactly 2.
- Normal Cases: Typical valid inputs.
- Boundary Cases: Minimum constraints, maximum constraints.
- Edge Cases: Empty input, duplicate values, negative numbers, disconnected graphs, max recursion depth, etc.
- Performance Cases: Near maximum constraints to expose inefficient algorithms.
- Corner Cases: Unexpected valid inputs.
Time Limit should be realistic (e.g., 1000-5000 ms based on complexity). Memory limit should be realistic (128-512 MB).
Constraints must be realistic (e.g., 1 <= n <= 2*10^5).
The hidden test cases must be robust enough to reject hardcoded solutions, greedy-only incorrect solutions, integer boundary mistakes, etc.`;

  return askGroqForJson(prompt, validateMockOAResponse);
};

export const getFallbackMockOAJson = ({ company = "", level, duration }) => {
  return {
    title: `${company || "Generic"} ${level} Mock OA`,
    company: company || "generic",
    level,
    duration: Number(duration),
    questions: [
      {
        title: "Window Score Analyzer",
        description:
          "Given n integers and an integer k, print the maximum sum of any contiguous subarray of length k.",
        difficulty: level,
        inputFormat:
          "The first line contains n and k. The second line contains n space-separated integers.",
        outputFormat: "Print one integer, the maximum subarray sum of length k.",
        constraints: "1 <= k <= n <= 100000, -10000 <= a[i] <= 10000",
        examples: [
          {
            input: "5 2\n1 2 3 4 5",
            output: "9",
            explanation: "The best length-2 subarray is 4 5 with sum 9.",
          },
        ],
        testCases: [
          { input: "5 2\n1 2 3 4 5", output: "9", isHidden: false },
          { input: "4 4\n-5 -2 -3 -4", output: "-14", isHidden: true, category: "normal" },
          { input: "6 3\n2 -1 3 5 -2 4", output: "7", isHidden: true, category: "boundary" },
        ],
        timeLimit: 2000,
        memoryLimit: 256,
        tags: ["Sliding Window", "Array"],
        functionSignature: "int maxWindowSum(vector<int> arr, int k)",
      },
      {
        title: "Component Query System",
        description:
          "Process union and size queries on n nodes. Type 1 u v merges components. Type 2 u prints the size of u's component.",
        difficulty: level,
        inputFormat:
          "The first line contains n and m. Each of the next m lines contains either 1 u v or 2 u.",
        outputFormat: "For every type 2 query, print the component size on a new line.",
        constraints: "1 <= n, m <= 200000",
        examples: [
          {
            input: "5 6\n1 1 2\n2 1\n1 3 4\n1 2 3\n2 4\n2 5",
            output: "2\n4\n1",
            explanation: "The queried component sizes are 2, 4, and 1.",
          },
        ],
        testCases: [
          { input: "3 3\n1 1 2\n1 2 3\n2 1", output: "3", isHidden: false },
          { input: "4 4\n2 1\n1 1 2\n2 2\n2 3", output: "1\n2\n1", isHidden: true, category: "edge" }
        ],
        timeLimit: 2000,
        memoryLimit: 256,
        tags: ["DSU", "Union Find"],
        functionSignature: "vector<int> componentQueries(int n, vector<vector<int>> queries)",
      },
      {
        title: "Greedy Deadline Rewards",
        description:
          "Given jobs with deadline and reward, schedule at most one job per day before its deadline to maximize total reward.",
        difficulty: level,
        inputFormat:
          "The first line contains n. Each of the next n lines contains deadline and reward.",
        outputFormat: "Print the maximum total reward.",
        constraints: "1 <= n <= 100000, 1 <= deadline <= 100000, 1 <= reward <= 100000",
        examples: [
          {
            input: "4\n1 10\n1 20\n2 50\n2 30",
            output: "70",
            explanation: "Choose rewards 20 and 50.",
          },
        ],
        testCases: [
          { input: "4\n1 10\n1 20\n2 50\n2 30", output: "70", isHidden: false },
          { input: "3\n1 5\n2 10\n2 20", output: "25", isHidden: true, category: "normal" }
        ],
        timeLimit: 2000,
        memoryLimit: 256,
        tags: ["Greedy", "Heap"],
        functionSignature: "long long maxReward(vector<pair<int,int>> jobs)",
      },
    ],
  };
};

export const createMockOAWithProblems = async ({ userId, company, level, duration, oaJson }) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const [mockOA] = await MockOA.create(
        [
          {
            user: userId,
            company: company || "",
            level,
            duration: Number(duration),
            status: "generated",
          },
        ],
        { session, ordered: true },
      );

      const problemsToCreate = oaJson.questions.map((question) => {
        const testCasesArray = Array.isArray(question.testCases) ? question.testCases : [];
        const sampleTestCases = testCasesArray.filter(tc => !tc.isHidden).map(tc => ({
          input: String(tc.input ?? ""),
          output: String(tc.output ?? ""),
        }));
        const hiddenTestCases = testCasesArray.filter(tc => tc.isHidden).map(tc => ({
          input: String(tc.input ?? ""),
          output: String(tc.output ?? ""),
        }));
        const testCases = testCasesArray.map((tc) => ({
          input: String(tc.input ?? ""),
          output: String(tc.output ?? ""),
        }));

        return {
          title: question.title,
          description: question.description,
          difficulty: normalizeDifficulty(question.difficulty, level),
          inputFormat: question.inputFormat || "Read input from stdin.",
          outputFormat: question.outputFormat || "Print output to stdout.",
          constraints: question.constraints,
          tags: Array.isArray(question.tags) ? question.tags : [],
          examples: Array.isArray(question.examples) ? question.examples : [],
          sampleTestCases,
          hiddenTestCases,
          testCases,
          timeLimit: Number(question.timeLimit || 2),
          memoryLimit: Number(question.memoryLimit || 256),
          functionSignature: question.functionSignature || "",
          expectedFunctionSignature: question.functionSignature || "",
          source: "mockoa",
          visibility: "private",
          owner: userId,
          oaId: mockOA._id,
          createdBy: userId,
        };
      });

      const problems = await Problem.create(problemsToCreate, {
        session,
        ordered: true,
      });
      mockOA.questionIds = problems.map((problem) => problem._id);
      await mockOA.save({ session });

      result = {
        mockOA,
        problems,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};
