import { GraduationCapIcon, UsersIcon } from "lucide-react";
import { useSetMyRole } from "../hooks/useUser";

function RoleSelectionPage() {
  const setMyRoleMutation = useSetMyRole();

  const handleSelect = (role) => {
    setMyRoleMutation.mutate(role);
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to Talent IQ</h1>
        <p className="text-base-content/70 mb-10">Tell us who you are to get started</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            disabled={setMyRoleMutation.isPending}
            onClick={() => handleSelect("student")}
            className="card bg-base-100 p-8 hover:scale-105 transition-transform border border-primary/20 disabled:opacity-50"
          >
            <GraduationCapIcon className="size-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">I'm a Student</h2>
            <p className="text-sm text-base-content/60">
              Practice coding, take mock interviews, and improve your skills
            </p>
          </button>

          <button
            disabled={setMyRoleMutation.isPending}
            onClick={() => handleSelect("interviewer")}
            className="card bg-base-100 p-8 hover:scale-105 transition-transform border border-secondary/20 disabled:opacity-50"
          >
            <UsersIcon className="size-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-xl font-bold mb-2">I'm an Interviewer</h2>
            <p className="text-sm text-base-content/60">
              Conduct technical interviews and evaluate candidates. Requires admin approval —
              you'll start as a student until approved.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
