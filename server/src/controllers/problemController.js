import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
  try {
    const Questions = await Problem.find();

    return res.status(200).json({
      count: Questions.length,
      Questions,
    });
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

    const Question = await Problem.findById(req.params.id);

    if (!Question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    return res.status(200).json({
      Question,
    });
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
      createdBy: req.user.userId,
    });

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
      createdBy,
    } = req.body;
    const question = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        inputFormat,
        outputFormat,
        constraints,
        tags,
        examples,
        testCases,
      },
      {
        returnDocument: "after",
      },
    );

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
    const { QuestionId } = req.params;
    const question = await Problem.findByIdAndDelete(id);

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
