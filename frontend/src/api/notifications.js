import axiosInstance from "../lib/axios";

export const notificationApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  },
  markRead: async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await axiosInstance.patch("/notifications/read-all");
    return response.data;
  },
};
