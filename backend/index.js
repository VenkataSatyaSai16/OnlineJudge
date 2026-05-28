const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const DBConnection = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemPage");
const submitRoutes = require("./routes/submit");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
DBConnection();

// Routes
app.use("/", authRoutes);
app.use("/problems", problemRoutes);
app.use("/problems", submitRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the server at: http://localhost:${PORT}`);
});
