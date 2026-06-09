import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //Check if user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    //Hash and store in DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //JWT
    const token = generateToken(user._id, user.role);

    //Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Registration Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //Check in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found with email",
      });
    }
    if (user.provider === "google") {
      return res.status(400).json({
        message: "Please sign in with Google",
      });
    }

    //Check pwd
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    //JWT
    const token = generateToken(user._id, user.role);

    //Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(
      process.env.GOOGLE_PLACEHOLDER_PASSWORD,
      10,
    );

    if (!user) {
      user = await User.create({
        username,
        email,
        provider: "google",
        role,
        password: hashedPassword,
      });
    }

    const token = generateToken(user._id,user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Google Login Failed",
    });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const existingUser = await User.findOne({
      username,
    });

    return res.status(200).json({
      available: !existingUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
