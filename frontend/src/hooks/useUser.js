import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userApi } from "../api/users";

export const useCurrentDbUser = (options = {}) => {
  return useQuery({
    queryKey: ["currentDbUser"],
    queryFn: userApi.getMe,
    retry: false,
    ...options,
  });
};

export const useSetMyRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.setMyRole,
    onSuccess: (data) => {
      if (data?.pendingApproval) {
        toast.success(
          "Your interviewer request has been sent. Admin will approve you as an interviewer soon — you can use Talent IQ as a student until then.",
          { duration: 6000 }
        );
      } else {
        toast.success("Role set successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["currentDbUser"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to set role"),
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: userApi.listUsers,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => userApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update role"),
  });
};
