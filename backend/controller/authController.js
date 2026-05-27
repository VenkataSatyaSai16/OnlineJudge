const AuthUser = require("../model/authUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 * @route POST /register
 */
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!(firstName && lastName && email && password)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required information: firstName, lastName, email, and password"
            });
        }

        // Check if user already exists
        const existingUser = await AuthUser.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = await AuthUser.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: "24h",
            }
        );

        // Prepare user response (exclude password)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(201).json({ 
            success: true,
            message: "User registered successfully!",
        });

    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during registration"
        });
    }
};

/**
 * Login user
 * @route POST /login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!(email && password)) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            });
        }

        // Find user by email
        const user = await AuthUser.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: "24h",
            }
        );

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Prepare user response (exclude password)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        res.status(200)
           .cookie("token", token, cookieOptions)
           .json({
               success: true,
               message: "Login successful!",
               user: userResponse,
               token: token
           });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
};

module.exports = { register, login };