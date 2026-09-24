import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const FREQUENCIES = ["High", "Medium", "Low"];
const ALL_COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Uber", "Netflix", "Adobe"];

function ProblemForm({ initial, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    difficulty: initial?.difficulty || "Easy",
    category: initial?.category || "",
    topic: initial?.topic || "",
    frequency: initial?.frequency || "Medium",
    description: initial?.description || "",
    descriptionNotes: (initial?.descriptionNotes || []).join("\n"),
    companies: initial?.companies || [],
    isActive: initial?.isActive ?? true,
    functionName: initial?.functionName || "",
    starterCodeJs: initial?.starterCode?.javascript || "function solve(a) {\n  // Write your solution here\n}",
    constraints: (initial?.constraints || []).join("\n"),
    examples: initial?.examples?.length
      ? initial.examples
      : [{ input: "", output: "", explanation: "" }],
    testCases: initial?.testCases?.length
      ? initial.testCases
      : [{ input: "", output: "" }],
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleCompany = (company) => {
    setForm((f) => ({
      ...f,
      companies: f.companies.includes(company)
        ? f.companies.filter((c) => c !== company)
        : [...f.companies, company],
    }));
  };

  const updateListItem = (key, index, field, value) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addListItem = (key, blank) => setForm((f) => ({ ...f, [key]: [...f[key], blank] }));

  const removeListItem = (key, index) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.functionName || !form.starterCodeJs) return;
    if (form.testCases.some((tc) => !tc.input || !tc.output)) return;

    onSubmit({
      title: form.title,
      slug: form.slug,
      difficulty: form.difficulty,
      category: form.category,
      topic: form.topic,
      frequency: form.frequency,
      description: form.description,
      descriptionNotes: form.descriptionNotes.split("\n").map((s) => s.trim()).filter(Boolean),
      companies: form.companies,
      isActive: form.isActive,
      functionName: form.functionName,
      starterCode: { javascript: form.starterCodeJs },
      constraints: form.constraints.split("\n").map((s) => s.trim()).filter(Boolean),
      examples: form.examples.filter((ex) => ex.input || ex.output),
      testCases: form.testCases.filter((tc) => tc.input && tc.output),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 p-6 space-y-3 max-h-[85vh] overflow-y-auto">
      <h3 className="text-lg font-bold">{initial ? "Edit Problem" : "New Problem"}</h3>

      <input
        className="input input-bordered w-full"
        placeholder="Title"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="Slug (auto from title if empty)"
        value={form.slug}
        onChange={(e) => set("slug", e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select className="select select-bordered" value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="select select-bordered" value={form.frequency} onChange={(e) => set("frequency", e.target.value)}>
          {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="input input-bordered"
          placeholder="Category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Topic"
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
        />
      </div>

      <textarea
        className="textarea textarea-bordered w-full"
        rows={3}
        placeholder="Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full"
        rows={2}
        placeholder="Description notes (one per line, optional)"
        value={form.descriptionNotes}
        onChange={(e) => set("descriptionNotes", e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full"
        rows={2}
        placeholder="Constraints (one per line, optional)"
        value={form.constraints}
        onChange={(e) => set("constraints", e.target.value)}
      />

      <div>
        <p className="text-sm font-medium mb-2">Companies</p>
        <div className="flex flex-wrap gap-2">
          {ALL_COMPANIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => toggleCompany(c)}
              className={`badge ${form.companies.includes(c) ? "badge-primary" : "badge-outline"} cursor-pointer`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="divider my-1">Solving (JavaScript)</div>

      <input
        className="input input-bordered w-full font-mono text-sm"
        placeholder="Function name, e.g. twoSum"
        value={form.functionName}
        onChange={(e) => set("functionName", e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full font-mono text-sm"
        rows={4}
        placeholder="JavaScript starter code"
        value={form.starterCodeJs}
        onChange={(e) => set("starterCodeJs", e.target.value)}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            Test Cases <span className="text-error">*</span>
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1"
            onClick={() => addListItem("testCases", { input: "", output: "" })}
          >
            <PlusIcon className="size-3" /> Add
          </button>
        </div>
        <p className="text-xs text-base-content/50 mb-2">
          Input is a JSON array of the function's arguments, e.g. <code>[2, 3]</code>. Output is the
          JSON-stringified expected return value, e.g. <code>5</code> or <code>&quot;hi&quot;</code>.
        </p>
        <div className="space-y-2">
          {form.testCases.map((tc, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2">
              <input
                className="input input-bordered input-sm flex-1 font-mono"
                placeholder="Input, e.g. [2, 3]"
                value={tc.input}
                onChange={(e) => updateListItem("testCases", i, "input", e.target.value)}
              />
              <input
                className="input input-bordered input-sm flex-1 font-mono"
                placeholder="Expected output, e.g. 5"
                value={tc.output}
                onChange={(e) => updateListItem("testCases", i, "output", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => removeListItem("testCases", i)}
                disabled={form.testCases.length === 1}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Examples (shown to students)</p>
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1"
            onClick={() => addListItem("examples", { input: "", output: "", explanation: "" })}
          >
            <PlusIcon className="size-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.examples.map((ex, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2">
              <input
                className="input input-bordered input-sm flex-1"
                placeholder="Input, e.g. a = [2,3]"
                value={ex.input}
                onChange={(e) => updateListItem("examples", i, "input", e.target.value)}
              />
              <input
                className="input input-bordered input-sm flex-1"
                placeholder="Output, e.g. 5"
                value={ex.output}
                onChange={(e) => updateListItem("examples", i, "output", e.target.value)}
              />
              <input
                className="input input-bordered input-sm flex-1"
                placeholder="Explanation (optional)"
                value={ex.explanation}
                onChange={(e) => updateListItem("examples", i, "explanation", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => removeListItem("examples", i)}
                disabled={form.examples.length === 1}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="checkbox checkbox-sm" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
        <span className="text-sm">Active (visible to students)</span>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting || !form.title || !form.functionName || !form.starterCodeJs}
        >
          {initial ? "Save Changes" : "Create"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ProblemForm;
