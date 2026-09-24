import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BuildingIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import {
  COMPANY_QUESTIONS,
  COMPANIES,
  FREQUENCIES,
  TOPICS,
} from "../data/companyQuestions";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const difficultyBadge = {
  Easy: "badge-success",
  Medium: "badge-warning",
  Hard: "badge-error",
};

const frequencyBadge = {
  High: "badge-error",
  Medium: "badge-warning",
  Low: "badge-ghost",
};

function CompanyQuestionBankPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [frequency, setFrequency] = useState("");

  const filtered = useMemo(() => {
    return COMPANY_QUESTIONS.filter((q) => {
      if (company && !q.companies.includes(company)) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (topic && q.topic !== topic) return false;
      if (frequency && q.frequency !== frequency) return false;
      return true;
    });
  }, [company, difficulty, topic, frequency]);

  const resetFilters = () => {
    setCompany("");
    setDifficulty("");
    setTopic("");
    setFrequency("");
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <BuildingIcon className="size-7 text-primary" />
          <h1 className="text-2xl font-bold">Company Question Bank</h1>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="select select-bordered" value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="">All Companies</option>
              {COMPANIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select className="select select-bordered" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select className="select select-bordered" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select className="select select-bordered" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="">All Frequencies</option>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm opacity-60">{filtered.length} questions</span>
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        {/* Table */}
        <div className="card bg-base-100 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Difficulty</th>
                <th>Topic</th>
                <th>Frequency</th>
                <th>Companies</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td className="font-medium">{q.title}</td>
                  <td>
                    <span className={`badge ${difficultyBadge[q.difficulty]}`}>{q.difficulty}</span>
                  </td>
                  <td>{q.topic}</td>
                  <td>
                    <span className={`badge ${frequencyBadge[q.frequency]}`}>{q.frequency}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {q.companies.map((c) => (
                        <span key={c} className="badge badge-outline badge-sm">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/problem/${q.id}`)}>
                      Solve
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center opacity-60 py-8">
                    No questions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompanyQuestionBankPage;
