import User from "../models/User.js";

const getMonthKey = () => {
  return new Date().toISOString().slice(0, 7);
};

const getDayKey = () => {
  return new Date().toISOString().slice(0, 10);
};

const LIMITS = {
  studyPlan: Number(process.env.STUDY_PLAN_MONTHLY_LIMIT || 10),
  mockOa: Number(process.env.MOCK_OA_MONTHLY_LIMIT || 5),
  aiComplexity: Number(process.env.AI_COMPLEXITY_DAILY_LIMIT || 10),
  aiGenerate: Number(process.env.AI_GENERATE_DAILY_LIMIT || 5),
};

const ensureCurrentMonth = (user) => {
  const monthKey = getMonthKey();

  if (!user.aiUsage || user.aiUsage.monthKey !== monthKey) {
    if (!user.aiUsage) {
      user.aiUsage = {};
    }
    user.aiUsage.monthKey = monthKey;
    user.aiUsage.studyPlanMonthlyCount = 0;
    user.aiUsage.mockOaMonthlyCount = 0;
  }

  return monthKey;
};

const ensureCurrentDay = (user) => {
  const dayKey = getDayKey();

  if (!user.aiUsage || user.aiUsage.dayKey !== dayKey) {
    if (!user.aiUsage) {
      user.aiUsage = {};
    }
    user.aiUsage.dayKey = dayKey;
    user.aiUsage.aiComplexityDailyCount = 0;
    user.aiUsage.aiGenerateDailyCount = 0;
  }

  return dayKey;
};

export const assertAiUsageAvailable = async (userId, type) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isDaily = ["aiComplexity", "aiGenerate"].includes(type);
  const timeKey = isDaily ? ensureCurrentDay(user) : ensureCurrentMonth(user);

  let countField;
  if (type === "mockOa") countField = "mockOaMonthlyCount";
  else if (type === "studyPlan") countField = "studyPlanMonthlyCount";
  else if (type === "aiComplexity") countField = "aiComplexityDailyCount";
  else if (type === "aiGenerate") countField = "aiGenerateDailyCount";

  const used = user.aiUsage[countField] || 0;
  const limit = LIMITS[type];

  if (used >= limit) {
    const error = new Error(isDaily ? "Daily AI usage limit reached" : "Monthly AI usage limit reached");
    error.statusCode = 429;
    error.code = isDaily ? "AI_DAILY_LIMIT_REACHED" : "AI_MONTHLY_LIMIT_REACHED";
    error.usage = { used, limit, timeKey };
    throw error;
  }

  return {
    used,
    limit,
    timeKey,
  };
};

export const incrementAiUsage = async (userId, type) => {
  const user = await User.findById(userId);
  
  const isDaily = ["aiComplexity", "aiGenerate"].includes(type);
  const timeKey = isDaily ? ensureCurrentDay(user) : ensureCurrentMonth(user);

  let countField;
  if (type === "mockOa") countField = "mockOaMonthlyCount";
  else if (type === "studyPlan") countField = "studyPlanMonthlyCount";
  else if (type === "aiComplexity") countField = "aiComplexityDailyCount";
  else if (type === "aiGenerate") countField = "aiGenerateDailyCount";

  user.aiUsage[countField] = (user.aiUsage[countField] || 0) + 1;
  await user.save();

  return {
    used: user.aiUsage[countField],
    limit: LIMITS[type],
    timeKey,
  };
};

export const getAiUsage = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  
  ensureCurrentMonth(user);
  ensureCurrentDay(user);
  await user.save();

  return {
    studyPlan: {
      used: user.aiUsage.studyPlanMonthlyCount || 0,
      limit: LIMITS.studyPlan,
    },
    mockOa: {
      used: user.aiUsage.mockOaMonthlyCount || 0,
      limit: LIMITS.mockOa,
    },
    aiComplexity: {
      used: user.aiUsage.aiComplexityDailyCount || 0,
      limit: LIMITS.aiComplexity,
    },
    aiGenerate: {
      used: user.aiUsage.aiGenerateDailyCount || 0,
      limit: LIMITS.aiGenerate,
    },
  };
};
