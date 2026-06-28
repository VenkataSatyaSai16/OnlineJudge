import Problem from "../models/Problem.js";
import { deleteByPrefix, getCache, setCache } from "../services/cacheService.js";

export const getProblems = async (req, res) => {
  try {
    const cached = await getCache("problems:list:public");
    if (cached) return res.status(200).json(cached);

    const Questions = await Problem.find({ visibility: "public" });

    const payload = {
      count: Questions.length,
      Questions,
    };

    await setCache("problems:list:public", payload, 300);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Cannot Fetch Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    //const { id } = req.params.id;

    const cacheKey = `problem:${req.params.id}:${req.user?.userId || "public"}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json(cached);

    const Question = await Problem.findById(req.params.id);

    if (!Question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (
      Question.visibility === "private" &&
      Question.owner?.toString() !== req.user?.userId &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to access this problem",
      });
    }


    const payload = {
      Question,
    };

    await setCache(cacheKey, payload, 300);
    return res.status(200).json(payload);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Cannot Fetch Problem",
    });
  }
};

export const addProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      tags,
      examples,
      testCases,
      timeLimit,
      memoryLimit,
    } = req.body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !inputFormat ||
      !outputFormat ||
      !constraints ||
      !examples ||
      !testCases
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (typeof title !== "string" || title.length > 150 || title.includes("\n")) {
      return res.status(400).json({
        message: "Invalid title. Must be a single line under 150 characters.",
      });
    }

    // Add 500ms buffer to timeLimit to ensure edge cases pass
    const finalTimeLimit = timeLimit ? Number(timeLimit) + 500 : 2500;
    const finalMemoryLimit = memoryLimit ? Number(memoryLimit) : 256;

    const question = await Problem.create({
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      tags,
      examples,
      testCases,
      timeLimit: finalTimeLimit,
      memoryLimit: finalMemoryLimit,
      createdBy: req.user.userId,
      owner: req.user.userId,
      source: "manual",
      visibility: "public",
    });

    await deleteByPrefix("problems:");

    return res.status(200).json({
      message: "Problem Added Successfully",
      question,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error",
    });
  }
};

export const editProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      tags,
      examples,
      testCases,
      timeLimit,
      memoryLimit,
      createdBy,
    } = req.body;

    if (title) {
      if (typeof title !== "string" || title.length > 150 || title.includes("\n")) {
        return res.status(400).json({
          message: "Invalid title. Must be a single line under 150 characters.",
        });
      }
    }

    const updateFields = {
      title,
      description,
      difficulty,
      inputFormat,
      outputFormat,
      constraints,
      tags,
      examples,
      testCases,
    };

    if (timeLimit !== undefined) {
      updateFields.timeLimit = Number(timeLimit) + 500;
    }
    if (memoryLimit !== undefined) {
      updateFields.memoryLimit = Number(memoryLimit);
    }

    const question = await Problem.findByIdAndUpdate(
      id,
      updateFields,
      {
        returnDocument: "after",
      },
    );

    await deleteByPrefix("problems:");
    await deleteByPrefix(`problem:${id}:`);

    return res.status(200).json({
      message: "Edited successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error",
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Problem.findByIdAndDelete(id);

    await deleteByPrefix("problems:");
    await deleteByPrefix(`problem:${id}:`);

    return res.status(200).json({
      message: "Delete successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error",
    });
  }
};
