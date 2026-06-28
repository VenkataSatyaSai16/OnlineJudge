import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const keyGenerator = (req) => {
  return req.user?.userId || ipKeyGenerator(req.ip);
};

const createLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    message: {
      message,
    },
  });
};

export const runLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: Number(process.env.RUN_RATE_LIMIT || 30),
  message: "Too many run requests. Please try again later.",
});

export const submitLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: Number(process.env.SUBMIT_RATE_LIMIT || 10),
  message: "Too many submit requests. Please try again later.",
});

export const otpLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.OTP_RATE_LIMIT || 5),
  message: "Too many OTP requests. Please try again later.",
});

export const studyPlanLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.STUDY_PLAN_RATE_LIMIT || 10),
  message: "Too many study plan requests. Please try again later.",
});

export const mockOaLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.MOCK_OA_RATE_LIMIT || 5),
  message: "Too many mock OA requests. Please try again later.",
});
