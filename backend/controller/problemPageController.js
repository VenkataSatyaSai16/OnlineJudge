const Questions = require("../model/questionsDB");

const createQuestion = async (req, res) => {
    try {
        const {
            questionId,
            question,
            difficultyLevel,
            questionDesc,
            sampleInput,
            sampleOutput,
            topics
        } = req.body;

        const topicList = Array.isArray(topics)
            ? topics
            : String(topics || "")
                .split(",")
                .map((topic) => topic.trim())
                .filter(Boolean);

        const newQuestion = await Questions.create({
            questionId,
            question,
            difficultyLevel,
            questionDesc,
            sampleInput,
            sampleOutput,
            topics: topicList
        });

        return res.status(201).json({
            success: true,
            message: "Question added successfully",
            data: newQuestion
        });
    } catch (error) {
        console.error("Error creating question:", error);

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Question ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error while creating question"
        });
    }
};

const listQuestions = async (req, res) => {
    try {
        const questions = await Questions.find({})
            .select("questionId question difficultyLevel topics")
            .sort({ questionId: 1 });

        return res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error("Error loading questions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while loading questions"
        });
    }
};

const loadQuestion = async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await Questions.findOne({ questionId: questionId });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        } else {
            return res.status(200).json({
                success: true,
                data: question
            });
        }
    } catch (error) {
        console.error("Error loading question:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while loading question"
        });
    }
};

module.exports = {
    createQuestion,
    listQuestions,
    loadQuestion
};
