import api from "../services/axiosInstance.js";

export const getStudyPlans = async () => {
  return await api.get("/study-plans");
};

export const saveStudyPlan = async (planData) => {
  return await api.post("/study-plans", planData);
};

export const toggleDayCompletion = async (planId, weekIndex, dayIndex, completed) => {
  return await api.put(`/study-plans/${planId}/complete`, {
    weekIndex,
    dayIndex,
    completed,
  });
};

export const deleteStudyPlan = (id) => {
    return api.delete(`/study-plans/${id}`);
};
