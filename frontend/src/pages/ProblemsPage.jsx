import { useMemo, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { toJudgeProblem } from "../lib/dbProblem";
import { useProblems } from "../hooks/useProblems";
import { ChevronRightIcon, Code2Icon, SearchIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

const COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Uber", "Netflix", "Adobe"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const FREQUENCIES = ["High", "Medium", "Low"];

function ProblemsPage() {
  const { data: dbProblemsData } = useProblems();
  const allProblems = useMemo(
    () => [...Object.values(PROBLEMS), ...(dbProblemsData?.problems || []).map(toJudgeProblem)],
    [dbProblemsData]
  );

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");
  const [frequency, setFrequency] = useState("");
  const [visible, setVisible] = useState(50);

  const filtered = useMemo(() => {
    return allProblems.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (company && !(p.companies || []).includes(company)) return false;
      if (frequency && p.frequency !== frequency) return false;
      return true;
    });
  }, [allProblems, search, difficulty, company, frequency]);

  const shown = filtered.slice(0, visible);

  const counts = {
    total: allProblems.length,
    easy: allProblems.filter((p) => p.difficulty === "Easy").length,
    medium: allProblems.filter((p) => p.difficulty === "Medium").length,
    hard: allProblems.filter((p) => p.difficulty === "Hard").length,
  };

  const resetFilters = () => {
    setSearch("");
    setDifficulty("");
    setCompany("");
    setFrequency("");
    setVisible(50);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            {counts.total} DSA problems · filter by difficulty, company & frequency
          </p>
        </div>

        {/* FILTERS */}
        <div className="card bg-base-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="input input-bordered flex items-center gap-2">
              <SearchIcon className="size-4 opacity-60" />
              <input
                type="text"
                className="grow"
                placeholder="Search problems"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisible(50); }}
              />
            </label>

            <select className="select select-bordered" value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setVisible(50); }}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select className="select select-bordered" value={company} onChange={(e) => { setCompany(e.target.value); setVisible(50); }}>
              <option value="">All Companies</option>
              {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="select select-bordered" value={frequency} onChange={(e) => { setFrequency(e.target.value); setVisible(50); }}>
              <option value="">All Frequencies</option>
              {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm opacity-60">{filtered.length} results</span>
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {shown.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Code2Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h2 className="text-lg font-bold">{problem.title}</h2>
                          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          {problem.frequency && (
                            <span className="badge badge-outline badge-sm">{problem.frequency} freq</span>
                          )}
                        </div>
                        <p className="text-xs text-base-content/60">{problem.category}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(problem.companies || []).map((c) => (
                            <span key={c} className="badge badge-ghost badge-sm">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary shrink-0">
                    <span className="font-medium hidden sm:inline">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {shown.length === 0 && (
            <div className="text-center py-12 opacity-60">No problems match these filters.</div>
          )}
        </div>

        {visible < filtered.length && (
          <div className="text-center mt-6">
            <button className="btn btn-outline" onClick={() => setVisible((v) => v + 50)}>
              Load More ({filtered.length - visible} remaining)
            </button>
          </div>
        )}

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total</div>
                <div className="stat-value text-primary">{counts.total}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{counts.easy}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{counts.medium}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{counts.hard}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;
