import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askGroq = async (prompt, options = {}) => {
  const request = {
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  if (options.json) {
    request.response_format = {
      type: "json_object",
    };
  }

  const response = await groq.chat.completions.create(request);

  return response.choices[0].message.content;
}
