import api from "../services/axiosInstance.js";

export const getMockOAs = () => {
    return api.get("/mock-oa");
}

export const getMockOAById = (oaId) => {
    return api.get(`/mock-oa/${oaId}`);
}

export const startMockOA = (oaId) => {
    return api.post(`/mock-oa/${oaId}/start`);
}

export const getMockOAProblems = (oaId) => {
    return api.get(`/mock-oa/${oaId}/problems`);
}

export const submitMockOA = (oaId) => {
    return api.post(`/mock-oa/${oaId}/submit`);
}

export const getMockOAResult = (oaId) => {
    return api.get(`/mock-oa/${oaId}/result`);
}
