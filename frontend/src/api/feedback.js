import axiosInstance from "../lib/axios";

export const feedbackApi = {
  submitFeedback: async (data) => {
    const response = await axiosInstance.post("/feedback", data);
    return response.data;
  },
  getFeedbackForSession: async (sessionId) => {
    const response = await axiosInstance.get(`/feedback/session/${sessionId}`);
    return response.data;
  },
  getMyGivenFeedback: async () => {
    const response = await axiosInstance.get("/feedback/mine");
    return response.data;
  },
};
