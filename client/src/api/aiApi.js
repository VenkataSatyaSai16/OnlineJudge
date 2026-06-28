import api from "../services/axiosInstance.js";

export const aiReview = (code) => {
    return  api.post("/ai/review" , code);
}

export const generateStudyPlan = (data) => {
    return api.post("/ai/study-plan", data);
}

export const generateMockOA = (data) => {
    return api.post("/ai/mock-oa", data);
}

export const analyzeProblemComplexity = (problemData) => {
    return api.post("/ai/problem/analyze", { problemData });
}

export const generateProblemFromPrompt = (data) => {
    return api.post("/ai/problem/generate", data);
}

export const getAiUsage = () => {
    return api.get("/ai/usage");
}
