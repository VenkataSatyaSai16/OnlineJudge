import api from "../services/axiosInstance.js";

export const getProfile = () => {
    return api.get("/profile/me");
}

export const getDetails = () =>{
    return api.get("/profile/me");
}