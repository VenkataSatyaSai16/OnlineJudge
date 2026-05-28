const express = require("express");
const { register, login, googleLogin } = require("../controller/authController");

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

module.exports = router;
