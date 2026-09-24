import axiosInstance from "../lib/axios";

export const progressApi = {
  getMyProgress: async () => {
    const response = await axiosInstance.get("/progress/me");
    return response.data;
  },
  recordSolved: async (data) => {
    const response = await axiosInstance.post("/progress/solved", data);
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await axiosInstance.get("/progress/leaderboard");
    return response.data;
  },
};
