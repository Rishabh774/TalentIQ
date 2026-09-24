import mongoose from "mongoose";

const solvedProblemSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    language: { type: String, default: "javascript" },
    solvedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    xp: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastSolvedDate: {
      type: Date,
      default: null,
    },
    solvedProblems: [solvedProblemSchema],
    achievements: [{ type: String }],
    // dates (YYYY-MM-DD) on which the daily challenge was completed
    dailyChallengesCompleted: [{ type: String }],
  },
  { timestamps: true }
);

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;
