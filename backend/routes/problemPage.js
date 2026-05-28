const express = require('express');
const { createQuestion, listQuestions, loadQuestion } = require("../controller/problemPageController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const Questions = require("../model/questionsDB");

const router = express.Router();

router.get('/', listQuestions);
router.post('/', requireAuth, requireAdmin, createQuestion);

router.get('/questionIds', async (req, res) => {
    try {
        const questionIds = await Questions.distinct('questionId');
        res.json({ questionIds });
    } catch (error) {
        console.error('Error fetching question IDs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:questionId', loadQuestion);


module.exports = router;
