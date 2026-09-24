import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { problemApi } from "../api/problems";

export const useProblems = () => {
  return useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.list,
  });
};

export const useAdminProblems = () => {
  return useQuery({
    queryKey: ["adminProblems"],
    queryFn: problemApi.listAll,
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemApi.create,
    onSuccess: () => {
      toast.success("Problem created");
      queryClient.invalidateQueries({ queryKey: ["adminProblems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create"),
  });
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => problemApi.update(id, data),
    onSuccess: () => {
      toast.success("Problem updated");
      queryClient.invalidateQueries({ queryKey: ["adminProblems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update"),
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: problemApi.remove,
    onSuccess: () => {
      toast.success("Problem deleted");
      queryClient.invalidateQueries({ queryKey: ["adminProblems"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete"),
  });
};
