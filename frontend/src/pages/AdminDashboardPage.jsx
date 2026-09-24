import { useState } from "react";
import Navbar from "../components/Navbar";
import ContentManagement from "../components/ContentManagement";
import { useAllUsers, useUpdateUserRole } from "../hooks/useUser";

const ROLES = ["student", "interviewer", "admin"];

function AdminDashboardPage() {
  const { data, isLoading } = useAllUsers();
  const updateRoleMutation = useUpdateUserRole();
  const [tab, setTab] = useState("users");

  const users = data?.users || [];

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="container mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold">Admin Control Center</h1>

        <div className="tabs tabs-boxed w-fit">
          <button className={`tab ${tab === "users" ? "tab-active" : ""}`} onClick={() => setTab("users")}>
            Users
          </button>
          <button className={`tab ${tab === "content" ? "tab-active" : ""}`} onClick={() => setTab("content")}>
            Content
          </button>
        </div>

        {tab === "content" && <ContentManagement />}

        {tab === "users" && (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-base-100 p-4">
            <p className="text-sm text-base-content/60">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="card bg-base-100 p-4">
            <p className="text-sm text-base-content/60">Interviewers</p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.role === "interviewer").length}
            </p>
          </div>
          <div className="card bg-base-100 p-4">
            <p className="text-sm text-base-content/60">Students</p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.role === "student").length}
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-4">User Management</h2>
          {isLoading ? (
            <p className="text-base-content/60">Loading...</p>
          ) : (
            <div className="overflow-x-auto card bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td className="capitalize">{u.role}</td>
                      <td>
                        {u.interviewerRequested && u.role !== "interviewer" && (
                          <span className="badge badge-warning badge-sm">Wants interviewer access</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="select select-sm select-bordered"
                          value={u.role}
                          onChange={(e) =>
                            updateRoleMutation.mutate({ id: u._id, role: e.target.value })
                          }
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
