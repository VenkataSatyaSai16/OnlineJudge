import User from "../models/User.js";

const emailVerifiedMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("emailVerified provider");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.user.provider === "google" || req.user.emailVerified || user.provider === "google" || user.emailVerified) {
      return next();
    }

    return res.status(403).json({
      message: "Please verify your email to access this feature.",
      code: "EMAIL_NOT_VERIFIED",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Email verification check failed",
    });
  }
};

export default emailVerifiedMiddleware;
