import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { progressApi } from "../api/progress";

export const useMyProgress = () => {
  return useQuery({
    queryKey: ["myProgress"],
    queryFn: progressApi.getMyProgress,
  });
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: progressApi.getLeaderboard,
  });
};

export const useRecordSolved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.recordSolved,
    onSuccess: (data) => {
      if (data.awardedXp > 0) {
        toast.success(`+${data.awardedXp} XP earned!`);
      }
      (data.newAchievements || []).forEach((ach) =>
        toast.success(`🏆 Achievement unlocked: ${ach.name}`, { duration: 5000 })
      );
      queryClient.invalidateQueries({ queryKey: ["myProgress"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
};
