import UserProgress from "../models/UserProgress.js";
import { getTodaysChallenge, dateKey, DAILY_BONUS_XP } from "../lib/dailyChallenge.js";
import { evaluateAchievements } from "../lib/gamification.js";

async function getOrCreateProgress(userId) {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) progress = await UserProgress.create({ user: userId });
  return progress;
}

export async function getTodayChallenge(req, res) {
  try {
    const challenge = getTodaysChallenge();
    const progress = await getOrCreateProgress(req.user._id);
    const completed = progress.dailyChallengesCompleted.includes(challenge.date);

    res.status(200).json({ challenge, completed, bonusXp: DAILY_BONUS_XP });
  } catch (error) {
    console.log("Error in getTodayChallenge controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function completeDailyChallenge(req, res) {
  try {
    const { problemId } = req.body;
    const challenge = getTodaysChallenge();
    const today = challenge.date;

    if (problemId !== challenge.problemId) {
      return res.status(400).json({ message: "This is not today's challenge problem" });
    }

    const progress = await getOrCreateProgress(req.user._id);

    if (progress.dailyChallengesCompleted.includes(today)) {
      return res.status(200).json({ progress, awardedXp: 0, alreadyCompleted: true });
    }

    progress.dailyChallengesCompleted.push(today);
    progress.xp += DAILY_BONUS_XP;
    const newAchievements = evaluateAchievements(progress);
    await progress.save();

    res.status(200).json({
      progress,
      awardedXp: DAILY_BONUS_XP,
      alreadyCompleted: false,
      newAchievements,
    });
  } catch (error) {
    console.log("Error in completeDailyChallenge controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
