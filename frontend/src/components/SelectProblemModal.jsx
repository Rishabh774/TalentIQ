import { Code2Icon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { PROBLEMS_BY_DIFFICULTY } from "../data/problems";
import { getDifficultyBadgeClass } from "../lib/utils";

function SelectProblemModal({ onSelect, isSubmitting }) {
  const difficulties = ["Easy", "Medium", "Hard"];
  const [activeDifficulty, setActiveDifficulty] = useState("Easy");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const problems = PROBLEMS_BY_DIFFICULTY[activeDifficulty] || [];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-2xl mb-2">Select a Problem</h3>
        <p className="text-base-content/60 mb-6">
          Your session is live. Pick a problem to start the interview.
        </p>

        <div className="space-y-4">
          <div className="join w-full">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                className={`btn join-item flex-1 ${
                  activeDifficulty === difficulty ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => {
                  setActiveDifficulty(difficulty);
                  setSelectedProblem(null);
                }}
              >
                {difficulty}
                <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
                  {PROBLEMS_BY_DIFFICULTY[difficulty].length}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
            {problems.map((problem) => {
              const isSelected = selectedProblem?.id === problem.id;

              return (
                <button
                  key={problem.id}
                  type="button"
                  className={`text-left rounded-lg border bg-base-100 p-4 transition-colors ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-base-300 hover:border-primary/60"
                  }`}
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-bold">{problem.title}</h4>
                      <p className="text-sm text-base-content/60">{problem.category}</p>
                    </div>
                    <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-base-content/75">
                    {problem.description.text}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedProblem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <span>
                Selected: <span className="font-medium">{selectedProblem.title}</span>
              </span>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={!selectedProblem || isSubmitting}
            onClick={() =>
              onSelect({
                problem: selectedProblem.title,
                difficulty: selectedProblem.difficulty.toLowerCase(),
              })
            }
          >
            {isSubmitting && <LoaderIcon className="size-4 animate-spin" />}
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectProblemModal;
