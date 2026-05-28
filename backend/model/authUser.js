const mongoose = require("mongoose");

/**
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 * Includes validation and constraints for user data
 */
const authUserSchema = new mongoose.Schema({
    // User's first name - required field with validation
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"]
    },
    
    // User's last name - required field with validation
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    
    // User's email address - must be unique across all users
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    
    // User's hashed password
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const AuthUser = mongoose.model("AuthUser", authUserSchema);

module.exports = AuthUser;
