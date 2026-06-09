import api from "../services/axiosInstance.js";

export const getProblems = () =>{
    return api.get("/problems");
}

export const getProblemById = (id) =>{
    return api.get(`/problems/${id}`);
}

export const addProblem = (problemData) => {
    return api.post("/problems/add",problemData);
}

export const editProblem = (id ,problemData) => {
    return api.put(`/problems/${id}/edit`,problemData);
}

export const deleteProblem = (id) => {
    return api.delete(`/problems/${id}/delete`);
}