import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dailyChallengeApi } from "../api/dailyChallenge";

export const useTodayChallenge = () => {
  return useQuery({
    queryKey: ["dailyChallenge"],
    queryFn: dailyChallengeApi.getToday,
  });
};

export const useCompleteDailyChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dailyChallengeApi.complete,
    onSuccess: (data) => {
      if (data.awardedXp > 0) {
        toast.success(`Daily challenge complete! +${data.awardedXp} bonus XP 🔥`, { duration: 5000 });
      }
      queryClient.invalidateQueries({ queryKey: ["dailyChallenge"] });
      queryClient.invalidateQueries({ queryKey: ["myProgress"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
};
