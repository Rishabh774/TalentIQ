import axiosInstance from "../lib/axios";

export const dailyChallengeApi = {
  getToday: async () => {
    const response = await axiosInstance.get("/daily-challenge/today");
    return response.data;
  },
  complete: async (problemId) => {
    const response = await axiosInstance.post("/daily-challenge/complete", { problemId });
    return response.data;
  },
};
