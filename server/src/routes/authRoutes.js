import express from "express";
import {
    registerUser,
    loginUser,
    googleLogin,
    checkUsername,
    checkEmail,
    logout,
    sendVerificationOtp,
    verifyEmailOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { otpLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/check-username/:username", checkUsername);
router.get("/check-email/:email", checkEmail);
router.post("/logout", logout);
router.post(
    "/send-verification-otp",
    authMiddleware,
    otpLimiter,
    sendVerificationOtp,
);
router.post("/verify-email-otp", authMiddleware, verifyEmailOtp);

export default router;
