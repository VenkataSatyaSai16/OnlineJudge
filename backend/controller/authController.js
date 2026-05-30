const AuthUser = require("../model/authUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addUserToLeaderboard } = require("../middleware/leaderboardMiddleware");

const createToken = (user) => jwt.sign(
    {
        id: user._id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "24h",
    }
);

const toUserResponse = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    profileImage: user.profileImage,
    createdAt: user.createdAt
});

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

        await addUserToLeaderboard(user);

        // Generate JWT token
        const token = createToken(user);

        // Prepare user response (exclude password)
        const userResponse = toUserResponse(user);

        res.status(201).json({ 
            success: true,
            message: "User registered successfully!",
            user: userResponse,
            token: token
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
        const token = createToken(user);

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Prepare user response (exclude password)
        const userResponse = toUserResponse(user);

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

const googleLogin = async (req, res) => {
    try {
        const { googleId, email, firstName, lastName, fullName, profileImage } = req.body;

        if (!(googleId && email)) {
            return res.status(400).json({
                success: false,
                message: "Google ID and email are required"
            });
        }

        const safeEmail = email.toLowerCase().trim();
        const nameParts = String(fullName || "").trim().split(" ").filter(Boolean);
        const nextFirstName = firstName || nameParts[0] || "Google";
        const nextLastName = lastName || nameParts.slice(1).join(" ") || "User";

        let user = await AuthUser.findOne({ email: safeEmail });

        if (user) {
            user.googleId = user.googleId || googleId;
            user.authProvider = user.authProvider || "google";
            user.profileImage = profileImage || user.profileImage;
            user.firstName = user.firstName || nextFirstName;
            user.lastName = user.lastName || nextLastName;
            await user.save();
        } else {
            user = await AuthUser.create({
                firstName: nextFirstName,
                lastName: nextLastName,
                email: safeEmail,
                authProvider: "google",
                googleId,
                profileImage,
            });
        }

        await addUserToLeaderboard(user);

        const token = createToken(user);

        res.status(200).json({
            success: true,
            message: "Google login successful!",
            user: toUserResponse(user),
            token
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during Google login"
        });
    }
};

module.exports = { register, login, googleLogin };
