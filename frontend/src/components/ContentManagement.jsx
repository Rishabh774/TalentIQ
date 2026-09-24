import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  useAdminProblems,
  useCreateProblem,
  useUpdateProblem,
  useDeleteProblem,
} from "../hooks/useProblems";
import ProblemForm from "./ProblemForm";

function ContentManagement() {
  const { data, isLoading } = useAdminProblems();
  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();
  const deleteMutation = useDeleteProblem();

  const [editing, setEditing] = useState(null); // problem object or "new" or null

  const problems = data?.problems || [];

  const handleSubmit = (form) => {
    if (editing === "new") {
      createMutation.mutate(form, { onSuccess: () => setEditing(null) });
    } else {
      updateMutation.mutate({ id: editing._id, data: form }, { onSuccess: () => setEditing(null) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this problem?")) deleteMutation.mutate(id);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Content Management — Problems</h2>
        <button className="btn btn-primary btn-sm gap-1" onClick={() => setEditing("new")}>
          <PlusIcon className="size-4" /> New Problem
        </button>
      </div>

      {isLoading ? (
        <p className="text-base-content/60">Loading...</p>
      ) : problems.length === 0 ? (
        <p className="text-base-content/60">No problems yet. Create the first one.</p>
      ) : (
        <div className="overflow-x-auto card bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Topic</th>
                <th>Companies</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p._id}>
                  <td className="font-medium">{p.title}</td>
                  <td>{p.difficulty}</td>
                  <td>{p.topic || "—"}</td>
                  <td>{p.companies?.length || 0}</td>
                  <td>
                    <span className={`badge badge-sm ${p.isActive ? "badge-success" : "badge-ghost"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => setEditing(p)}>
                        <PencilIcon className="size-4" />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(p._id)}>
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <ProblemForm
              initial={editing === "new" ? null : editing}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default ContentManagement;
