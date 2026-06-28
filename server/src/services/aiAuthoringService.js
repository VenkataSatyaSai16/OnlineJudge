import { askGroqForJson } from "./aiJsonService.js";

const validateComplexityResponse = (data) => {
  const required = [
    "difficulty",
    "topics",
    "expectedTimeComplexity",
    "expectedSpaceComplexity",
    "recommendedTimeLimit",
    "recommendedMemoryLimit",
    "confidence",
    "reasoning",
  ];

  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Complexity response is missing ${field}`);
    }
  }

  if (!Array.isArray(data.topics)) {
    throw new Error("Topics must be an array");
  }
};

export const analyzeComplexity = async (problemData) => {
  const prompt = `You are an expert algorithms engineer and competitive programming judge.
Analyze the following problem statement and its constraints. 

Problem Title: ${problemData.title}
Description: ${problemData.description}
Constraints: ${problemData.constraints}
Input Format: ${problemData.inputFormat || "N/A"}
Output Format: ${problemData.outputFormat || "N/A"}

Return ONLY JSON matching this exact schema:
{
  "difficulty": "Easy|Medium|Hard",
  "topics": ["string"],
  "expectedTimeComplexity": "string",
  "expectedSpaceComplexity": "string",
  "recommendedTimeLimit": number (in ms, e.g., 2000),
  "recommendedMemoryLimit": number (in MB, e.g., 256),
  "confidence": number (0-100),
  "reasoning": "string"
}

Rules:
- Be highly accurate with Time and Space complexity based on the constraints.
- Provide a concise reasoning.
- Return ONLY JSON.`;

  return askGroqForJson(prompt, validateComplexityResponse);
};

const validateGenerateResponse = (data) => {
  const required = [
    "title",
    "description",
    "constraints",
    "difficulty",
    "topics",
    "expectedTimeComplexity",
    "expectedSpaceComplexity",
    "recommendedTimeLimit",
    "recommendedMemoryLimit",
    "editorialSummary",
    "examples",
    "testCases"
  ];

  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Generated problem is missing ${field}`);
    }
  }

  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error("Title must be a non-empty string");
  }
  
  if (data.title.length > 150) {
    throw new Error("Title is too long (exceeds 150 characters)");
  }
  
  if (data.title.includes("\n")) {
    throw new Error("Title cannot contain multiline sample input");
  }

  if (!Array.isArray(data.examples) || !Array.isArray(data.testCases)) {
    throw new Error("Examples and test cases must be arrays");
  }
};

export const generateProblem = async ({ topic, difficulty, companyStyle, shortDescription, similarProblem }) => {
  const prompt = `You are an expert online assessment and competitive programming problem setter.
Generate a complete, high-quality coding problem.

Inputs:
Topic: ${topic}
Difficulty: ${difficulty}
Company Style: ${companyStyle || "Generic"}
Short Description: ${shortDescription}
Similar Problem: ${similarProblem || "None"}

The generated problem must match this exact JSON schema:
{
  "title": "string",
  "description": "string",
  "constraints": "string",
  "difficulty": "${difficulty}",
  "topics": ["string"],
  "expectedTimeComplexity": "string",
  "expectedSpaceComplexity": "string",
  "recommendedTimeLimit": number,
  "recommendedMemoryLimit": number,
  "editorialSummary": "string",
  "inputFormat": "string",
  "outputFormat": "string",
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
      "isHidden": boolean,
      "category": "normal|boundary|edge|performance|corner"
    }
  ]
}

Test Case Requirements (CRITICAL):
- Generate exactly 2 visible sample test cases (isHidden: false).
- Generate exactly 10 hidden test cases (isHidden: true).
- Categorize hidden cases accurately (normal, boundary, edge, performance, corner).
- Inputs and outputs must be plain ASCII and compatible with stdin/stdout.

Rules:
- Make constraints realistic.
- Every example and test case output must be mathematically correct.
- Return ONLY JSON.`;

  return askGroqForJson(prompt, validateGenerateResponse);
};
