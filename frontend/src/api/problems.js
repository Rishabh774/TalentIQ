import axiosInstance from "../lib/axios";

export const problemApi = {
  list: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },
  listAll: async () => {
    const response = await axiosInstance.get("/problems/all");
    return response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post("/problems", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.patch(`/problems/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await axiosInstance.delete(`/problems/${id}`);
    return response.data;
  },
};
