import axiosInstance from "../lib/axios";

export const userApi = {
  getMe: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },
  setMyRole: async (role) => {
    const response = await axiosInstance.post("/users/me/role", { role });
    return response.data;
  },
  listUsers: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosInstance.patch(`/users/${id}/role`, { role });
    return response.data;
  },
};
