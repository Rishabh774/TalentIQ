import { FlameIcon, StarIcon, TrophyIcon, CheckCircleIcon } from "lucide-react";
import { useMyProgress } from "../hooks/useProgress";

function GamificationPanel() {
  const { data, isLoading } = useMyProgress();

  const progress = data?.progress;
  const catalog = data?.achievementCatalog || [];
  const unlocked = new Set(progress?.achievements || []);

  if (isLoading) {
    return <div className="card bg-base-100 p-6 text-base-content/60">Loading progress...</div>;
  }

  return (
    <div className="card bg-base-100 p-6 space-y-6">
      <h2 className="text-lg font-bold">Your Progress</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <StarIcon className="size-6 mx-auto text-warning mb-1" />
          <div className="text-2xl font-black">{progress?.xp ?? 0}</div>
          <div className="text-xs opacity-60">XP</div>
        </div>
        <div className="text-center">
          <FlameIcon className="size-6 mx-auto text-error mb-1" />
          <div className="text-2xl font-black">{progress?.currentStreak ?? 0}</div>
          <div className="text-xs opacity-60">Day Streak</div>
        </div>
        <div className="text-center">
          <CheckCircleIcon className="size-6 mx-auto text-success mb-1" />
          <div className="text-2xl font-black">{progress?.solvedProblems?.length ?? 0}</div>
          <div className="text-xs opacity-60">Solved</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrophyIcon className="size-4" /> Achievements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {catalog.map((ach) => {
            const isUnlocked = unlocked.has(ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs border ${
                  isUnlocked
                    ? "border-primary/40 bg-primary/10 text-base-content"
                    : "border-base-300 text-base-content/40"
                }`}
              >
                <TrophyIcon className={`size-4 ${isUnlocked ? "text-warning" : "opacity-40"}`} />
                {ach.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GamificationPanel;
