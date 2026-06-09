import api from "../services/axiosInstance.js";

export const runCode = (data) =>{
    return api.post("/judge/run",data);
}

export const submitCode = (data) =>{
    return api.post("/judge/submit",data);
}
