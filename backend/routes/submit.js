const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Problem route is working!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

router.post('/submit', (req, res) => {
    const { problemId, solution } = req.body;  
    console.log(`Received solution for problem ${problemId}: ${solution}`);
    res.status(200).json({
        message: `Solution for problem ${problemId} received successfully!`,
        status: "success",
        timestamp: new Date().toISOString()
    });
}); 

module.exports = router;