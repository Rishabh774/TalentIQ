// Pool of problems eligible for the daily challenge.
// Keep ids in sync with the frontend PROBLEMS catalog.
export const DAILY_PROBLEM_POOL = [
  { problemId: "two-sum", difficulty: "easy" },
  { problemId: "reverse-string", difficulty: "easy" },
  { problemId: "valid-palindrome", difficulty: "easy" },
  { problemId: "maximum-subarray", difficulty: "medium" },
  { problemId: "container-with-most-water", difficulty: "medium" },
];

// bonus XP awarded on top of the normal solve XP for completing the daily challenge
export const DAILY_BONUS_XP = 20;

// UTC date string like "2026-06-21"
export function dateKey(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

// deterministically pick today's challenge from the pool based on the date
export function getTodaysChallenge(date = new Date()) {
  const key = dateKey(date);
  // simple stable hash of the date string
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const index = hash % DAILY_PROBLEM_POOL.length;
  return { ...DAILY_PROBLEM_POOL[index], date: key };
}
