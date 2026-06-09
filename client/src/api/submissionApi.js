import api from "../services/axiosInstance.js";

export const getUserSubmissions = () => {
    return api.get("/submission");
}