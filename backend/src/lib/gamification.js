export const XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// achievement definitions: id -> predicate over progress doc
export const ACHIEVEMENTS = [
  {
    id: "first_problem_solved",
    name: "First Problem Solved",
    check: (p) => p.solvedProblems.length >= 1,
  },
  {
    id: "seven_day_streak",
    name: "7-Day Streak",
    check: (p) => p.currentStreak >= 7 || p.longestStreak >= 7,
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    check: (p) => p.solvedProblems.length >= 10,
  },
  {
    id: "dsa_master",
    name: "DSA Master",
    check: (p) => p.solvedProblems.length >= 50,
  },
  {
    id: "interview_expert",
    name: "Interview Expert",
    check: (p) => p.xp >= 1000,
  },
];

// returns the list of newly unlocked achievement ids
export function evaluateAchievements(progress) {
  const unlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (!progress.achievements.includes(ach.id) && ach.check(progress)) {
      progress.achievements.push(ach.id);
      unlocked.push(ach.id);
    }
  }
  return unlocked;
}

// updates streak fields based on the last solved date vs now (UTC day boundaries)
export function updateStreak(progress, now = new Date()) {
  const today = startOfDay(now);

  if (!progress.lastSolvedDate) {
    progress.currentStreak = 1;
  } else {
    const last = startOfDay(progress.lastSolvedDate);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // already solved today, streak unchanged
    } else if (diffDays === 1) {
      progress.currentStreak += 1;
    } else {
      progress.currentStreak = 1;
    }
  }

  progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
  progress.lastSolvedDate = now;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}
