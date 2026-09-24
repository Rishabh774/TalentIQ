import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { feedbackApi } from "../api/feedback";

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackApi.submitFeedback,
    onSuccess: () => {
      toast.success("Feedback submitted!");
      queryClient.invalidateQueries({ queryKey: ["myGivenFeedback"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to submit feedback"),
  });
};

export const useFeedbackForSession = (sessionId) => {
  return useQuery({
    queryKey: ["feedback", sessionId],
    queryFn: () => feedbackApi.getFeedbackForSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useMyGivenFeedback = () => {
  return useQuery({
    queryKey: ["myGivenFeedback"],
    queryFn: feedbackApi.getMyGivenFeedback,
  });
};
