import api from "../services/axiosInstance.js";

export const getLeaderboard = ()=>{
    return api.get("/leaderboard");
}