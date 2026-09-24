import { useNavigate } from "react-router";
import { CalendarCheckIcon, FlameIcon } from "lucide-react";
import { useTodayChallenge } from "../hooks/useDailyChallenge";
import { PROBLEMS } from "../data/problems";

function DailyChallengeCard() {
  const navigate = useNavigate();
  const { data, isLoading } = useTodayChallenge();

  if (isLoading) {
    return <div className="card bg-base-100 p-6 text-base-content/60">Loading daily challenge...</div>;
  }

  const challenge = data?.challenge;
  const completed = data?.completed;
  const bonusXp = data?.bonusXp ?? 0;
  const problem = challenge ? PROBLEMS[challenge.problemId] : null;

  return (
    <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 p-6">
      <div className="flex items-center gap-2 mb-3">
        <FlameIcon className="size-5 text-error" />
        <h2 className="text-lg font-bold">Daily Challenge</h2>
        {completed && (
          <span className="badge badge-success gap-1 ml-auto">
            <CalendarCheckIcon className="size-3" /> Done
          </span>
        )}
      </div>

      {problem ? (
        <>
          <p className="font-semibold text-lg">{problem.title}</p>
          <p className="text-sm opacity-70 capitalize mb-1">
            {problem.difficulty} · {problem.category}
          </p>
          <p className="text-xs opacity-60 mb-4">Solve today's problem for +{bonusXp} bonus XP</p>
          <button
            className={`btn btn-sm ${completed ? "btn-outline" : "btn-primary"}`}
            onClick={() => navigate(`/problem/${challenge.problemId}`)}
          >
            {completed ? "Solve Again" : "Take Challenge"}
          </button>
        </>
      ) : (
        <p className="text-base-content/60">No challenge available today.</p>
      )}
    </div>
  );
}

export default DailyChallengeCard;
