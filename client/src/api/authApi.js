import api from "../services/axiosInstance.js";

export const registerUser = (userData) => {
    return  api.post("/auth/register" , userData);
}

export const loginUser = (userData) => {
    return api.post("/auth/login" , userData);
}

export const googleAuth = (userData) =>{
    return api.post("/auth/google",userData);
}

export const checkUsername = (username) => {
    return api.get(`/auth/check-username/${username}`);
}

export const checkEmail = (email) => {
    return api.get(`/auth/check-email/${email}`);
}

export const logoutUser = () =>{
    return api.post("/auth/logout");
}

export const sendVerificationOtp = () => {
    return api.post("/auth/send-verification-otp");
}

export const verifyEmailOtp = (otp) => {
    return api.post("/auth/verify-email-otp", { otp });
}
