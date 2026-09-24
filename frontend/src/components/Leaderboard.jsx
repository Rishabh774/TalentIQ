import { useLeaderboard } from "../hooks/useProgress";

function Leaderboard() {
  const { data, isLoading } = useLeaderboard();
  const board = data?.leaderboard || [];

  return (
    <div className="card bg-base-100 p-6">
      <h2 className="text-lg font-bold mb-4">🏅 Global Leaderboard</h2>

      {isLoading ? (
        <p className="text-base-content/60">Loading...</p>
      ) : board.length === 0 ? (
        <p className="text-base-content/60">No rankings yet. Solve problems to climb!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>XP</th>
                <th>Solved</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {board.map((entry) => (
                <tr key={entry.userId}>
                  <td className="font-bold">{entry.rank}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {entry.profileImage && (
                        <img src={entry.profileImage} alt="" className="size-6 rounded-full" />
                      )}
                      {entry.name}
                    </div>
                  </td>
                  <td>{entry.xp}</td>
                  <td>{entry.solvedCount}</td>
                  <td>{entry.currentStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
