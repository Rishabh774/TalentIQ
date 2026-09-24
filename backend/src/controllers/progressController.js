import UserProgress from "../models/UserProgress.js";
import {
  XP_BY_DIFFICULTY,
  ACHIEVEMENTS,
  evaluateAchievements,
  updateStreak,
} from "../lib/gamification.js";
import { createNotification } from "../lib/notifications.js";
import { sendEmail, emailTemplates } from "../lib/email.js";

async function notifyAchievements(user, achievementIds) {
  for (const id of achievementIds) {
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) continue;
    await createNotification({
      user: user._id,
      type: "achievement_alert",
      title: `Achievement unlocked: ${ach.name}`,
      message: "Great work! Keep solving to unlock more.",
    });
    const tmpl = emailTemplates.achievementUnlocked(user.name, ach.name);
    sendEmail({ to: user.email, ...tmpl });
  }
}

async function getOrCreateProgress(userId) {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) {
    progress = await UserProgress.create({ user: userId });
  }
  return progress;
}

export async function getMyProgress(req, res) {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    res.status(200).json({ progress, achievementCatalog: ACHIEVEMENTS.map((a) => ({ id: a.id, name: a.name })) });
  } catch (error) {
    console.log("Error in getMyProgress controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function recordSolved(req, res) {
  try {
    const { problemId, difficulty = "easy", language = "javascript" } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: "problemId is required" });
    }

    const progress = await getOrCreateProgress(req.user._id);

    const alreadySolved = progress.solvedProblems.some((p) => p.problemId === problemId);

    let awardedXp = 0;
    let newAchievements = [];

    if (!alreadySolved) {
      awardedXp = XP_BY_DIFFICULTY[difficulty] ?? XP_BY_DIFFICULTY.easy;
      progress.xp += awardedXp;
      progress.solvedProblems.push({ problemId, difficulty, language });
      updateStreak(progress);
      newAchievements = evaluateAchievements(progress);
      await progress.save();
      await notifyAchievements(req.user, newAchievements);
    }

    res.status(200).json({
      progress,
      awardedXp,
      alreadySolved,
      newAchievements: ACHIEVEMENTS.filter((a) => newAchievements.includes(a.id)).map((a) => ({
        id: a.id,
        name: a.name,
      })),
    });
  } catch (error) {
    console.log("Error in recordSolved controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const leaders = await UserProgress.find()
      .sort({ xp: -1 })
      .limit(limit)
      .populate("user", "name profileImage");

    const board = leaders
      .filter((entry) => entry.user)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.user._id,
        name: entry.user.name,
        profileImage: entry.user.profileImage,
        xp: entry.xp,
        solvedCount: entry.solvedProblems.length,
        currentStreak: entry.currentStreak,
      }));

    res.status(200).json({ leaderboard: board });
  } catch (error) {
    console.log("Error in getLeaderboard controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
