import { askGroq } from "./aiReviewService.js";
import { jsonrepair } from "jsonrepair";

class AiJsonError extends Error {
  constructor(message = "AI returned invalid JSON. Please try again.") {
    super(message);
    this.statusCode = 502;
    this.code = "AI_INVALID_JSON";
  }
}

const extractJson = (content) => {
  if (!content || typeof content !== "string") {
    throw new AiJsonError("AI returned an empty response. Please try again.");
  }

  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    try {
      return JSON.parse(jsonrepair(cleaned));
    } catch {
      // Fall through to extracting the largest JSON object.
    }

    const firstObject = cleaned.indexOf("{");
    const lastObject = cleaned.lastIndexOf("}");

    if (firstObject === -1 || lastObject === -1 || lastObject <= firstObject) {
      throw new AiJsonError("AI response did not contain JSON. Please try again.");
    }

    const jsonSlice = cleaned.slice(firstObject, lastObject + 1);

    try {
      return JSON.parse(jsonSlice);
    } catch {
      try {
        return JSON.parse(jsonrepair(jsonSlice));
      } catch {
        throw new AiJsonError();
      }
    }
  }
};

const validateParsed = (parsed, validate) => {
  try {
    validate(parsed);
    return parsed;
  } catch (error) {
    const validationError = new AiJsonError("AI JSON did not match the required schema.");
    validationError.details = error.message;
    throw validationError;
  }
};

export const askGroqForJson = async (prompt, validate) => {
  const firstResponse = await askGroq(prompt);

  try {
    return validateParsed(extractJson(firstResponse), validate);
  } catch (error) {
    const repairPrompt = `Convert the malformed response below into one valid JSON object that matches the requested schema.

Rules:
- Return JSON only.
- Do not use markdown.
- Do not include comments.
- Do not include trailing commas.
- Use plain ASCII characters.
- Escape newline characters inside strings.
- Preserve the intended data where possible.

Original schema request:
${prompt}

Malformed response:
${firstResponse}`;

    try {
      const repairedResponse = await askGroq(repairPrompt);
      return validateParsed(extractJson(repairedResponse), validate);
    } catch {
      throw new AiJsonError();
    }
  }
};
