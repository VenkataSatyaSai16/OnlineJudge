import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
  generateOtp,
  getOtpCooldownRemaining,
  getOtpExpiry,
  hashOtp,
  isOtpExpired,
  verifyOtpHash,
} from "../services/otpService.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { deleteCache, getCache, setCache } from "../services/cacheService.js";

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
      emailVerified: false,
    });

    await deleteCache(
      `username:${username.toLowerCase()}`,
      `email:${email.toLowerCase()}`,
    );

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
      message: "Registration Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error(error.message);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
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
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        emailVerified: user.emailVerified,
      },
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
        role: "user",
        emailVerified: true,
        password: hashedPassword,
      });
    } else if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = generateToken(user._id, user.role);

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
        emailVerified: user.emailVerified,
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

    const key = `username:${username.toLowerCase()}`;
    const cached = await getCache(key);

    if (cached) {
      return res.status(200).json(cached);
    }

    const existingUser = await User.findOne({ username });

    const result = {
      available: !existingUser,
      message: existingUser ? "Already Registered" : "Available",
    };

    await setCache(key, result, 600);

    return res.status(200).json(result);
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

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        available: false,
        message: "Invalid email",
      });
    }

    const normalizedEmail = email.toLowerCase();
    const key = `email:${normalizedEmail}`;
    const cached = await getCache(key);

    if (cached) {
      return res.status(200).json(cached);
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    const result = {
      available: !existingUser,
      message: existingUser ? "Already Registered" : "Available",
    };

    await setCache(key, result, 600);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendVerificationOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailVerified || user.provider === "google") {
      return res.status(200).json({
        message: "Email already verified",
        emailVerified: true,
      });
    }

    const cooldownRemaining = getOtpCooldownRemaining(
      user.emailVerificationLastSentAt,
    );

    if (cooldownRemaining > 0) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
        retryAfterSeconds: Math.ceil(cooldownRemaining / 1000),
      });
    }

    const otp = generateOtp();
    user.emailVerificationOtpHash = await hashOtp(otp);
    user.emailVerificationOtpExpiresAt = getOtpExpiry();
    user.emailVerificationLastSentAt = new Date();
    await user.save();
    console.log(user);

    const emailResult = await sendVerificationEmail(user.email, otp);

    return res.status(200).json({
      message: emailResult.sent
        ? "Verification OTP sent"
        : "Verification OTP generated. Configure SMTP to send email.",
      emailSent: emailResult.sent,
      devOtp: emailResult.sent ? undefined : otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Unable to send verification OTP",
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const providedOtp = String(otp || "").trim();

    if (!providedOtp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailVerified || user.provider === "google") {
      return res.status(200).json({
        message: "Email already verified",
        emailVerified: true,
      });
    }

    if (isOtpExpired(user.emailVerificationOtpExpiresAt)) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isMatch = await verifyOtpHash(
      providedOtp,
      user.emailVerificationOtpHash,
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.emailVerified = true;
    user.emailVerificationOtpHash = "";
    user.emailVerificationOtpExpiresAt = null;
    user.emailVerificationLastSentAt = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      emailVerified: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Unable to verify email",
    });
  }
};
