import { askGroqForJson } from "./aiJsonService.js";

export const validateStudyPlanInput = ({ goal, hoursPerDay, duration }) => {
  if (!goal || typeof goal !== "string" || goal.trim().length < 3) {
    return "Goal is required";
  }

  if (!hoursPerDay || Number(hoursPerDay) <= 0 || Number(hoursPerDay) > 12) {
    return "hoursPerDay must be between 1 and 12";
  }

  if (!duration || typeof duration !== "string") {
    return "Duration is required";
  }

  return null;
};

const validateStudyPlanResponse = (data) => {
  if (!data || !Array.isArray(data.weeks)) {
    throw new Error("Study plan must include weeks");
  }

  for (const week of data.weeks) {
    if (!week.week || !Array.isArray(week.days)) {
      throw new Error("Each week must include days");
    }

    for (const day of week.days) {
      if (!day.day || !Array.isArray(day.problems)) {
        throw new Error("Each day must include problems");
      }
    }
  }
};

export const generateStudyPlanJson = async ({ goal, hoursPerDay, duration }) => {
  const prompt = `You are an expert competitive programming study planner.

Return ONLY valid JSON. Do not include markdown, explanations, comments, or extra text.

Create a study plan for:
goal: "${goal}"
hoursPerDay: ${Number(hoursPerDay)}
duration: "${duration}"

The response must match this JSON shape exactly:
{
  "goal": "string",
  "hoursPerDay": number,
  "duration": "string",
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "day": 1,
          "focus": "string",
          "problems": [
            {
              "title": "Two Sum",
              "difficulty": "Easy",
              "tags": ["Array", "Hash Map"]
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Use arrays, not paragraphs.
- Each day must include 2 to 5 real coding practice problems depending on hoursPerDay.
- Include learning progression and mixed patterns.
- Return JSON only.`;

  return askGroqForJson(prompt, validateStudyPlanResponse);
};

export const getFallbackStudyPlanJson = ({ goal, hoursPerDay, duration }) => {
  return {
    goal,
    hoursPerDay: Number(hoursPerDay),
    duration,
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            focus: "Arrays and hash maps",
            problems: [
              { title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Map"] },
              { title: "Contains Duplicate", difficulty: "Easy", tags: ["Array", "Set"] },
              { title: "Group Anagrams", difficulty: "Medium", tags: ["Hash Map", "String"] },
            ],
          },
          {
            day: 2,
            focus: "Sliding window",
            problems: [
              { title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "Kadane"] },
              { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["Sliding Window"] },
              { title: "Minimum Size Subarray Sum", difficulty: "Medium", tags: ["Two Pointers"] },
            ],
          },
          {
            day: 3,
            focus: "Binary search and sorting",
            problems: [
              { title: "Binary Search", difficulty: "Easy", tags: ["Binary Search"] },
              { title: "Search in Rotated Sorted Array", difficulty: "Medium", tags: ["Binary Search"] },
              { title: "Koko Eating Bananas", difficulty: "Medium", tags: ["Binary Search"] },
            ],
          },
        ],
      },
      {
        week: 2,
        days: [
          {
            day: 1,
            focus: "Trees",
            problems: [
              { title: "Maximum Depth of Binary Tree", difficulty: "Easy", tags: ["Tree", "DFS"] },
              { title: "Validate Binary Search Tree", difficulty: "Medium", tags: ["BST", "DFS"] },
              { title: "Binary Tree Level Order Traversal", difficulty: "Medium", tags: ["BFS"] },
            ],
          },
          {
            day: 2,
            focus: "Graphs",
            problems: [
              { title: "Number of Islands", difficulty: "Medium", tags: ["DFS", "BFS"] },
              { title: "Course Schedule", difficulty: "Medium", tags: ["Graph", "Topological Sort"] },
              { title: "Clone Graph", difficulty: "Medium", tags: ["Graph"] },
            ],
          },
          {
            day: 3,
            focus: "Dynamic programming",
            problems: [
              { title: "Climbing Stairs", difficulty: "Easy", tags: ["DP"] },
              { title: "House Robber", difficulty: "Medium", tags: ["DP"] },
              { title: "Coin Change", difficulty: "Medium", tags: ["DP"] },
            ],
          },
        ],
      },
    ],
  };
};
