import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { BriefcaseIcon, BookOpenIcon, ShieldIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function RoleSelectionModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();
  const [loadingRoleId, setLoadingRoleId] = useState(null);

  const roles = [
    {
      id: "student",
      name: "Student",
      icon: BookOpenIcon,
      desc: "Practice DSA problems, solve daily challenges, track progress, join mock interviews.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "interviewer",
      name: "Interviewer",
      icon: BriefcaseIcon,
      desc: "Host live sessions, evaluate candidates, provide feedback. Needs admin approval after sign-in.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "admin",
      name: "Admin",
      icon: ShieldIcon,
      desc: "Manage users, content, problems. Only the platform owner's account becomes admin.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onError: (err) => {
      console.error("Google sign-in error:", err);
      toast.error("Google sign-in failed");
      setLoadingRoleId(null);
    },
    onSuccess: async (tokenResponse) => {
      try {
        await signInWithGoogle({ accessToken: tokenResponse.access_token });
        onClose();
      } catch (err) {
        console.error("Backend auth error:", err);
        const data = err.response?.data;
        console.error("Server response:", data);
        toast.error(
          data?.detail || data?.message || "Sign-in failed"
        );
        sessionStorage.removeItem("selectedRole");
      } finally {
        setLoadingRoleId(null);
      }
    },
  });

  const handleRoleSelect = (roleId) => {
    sessionStorage.setItem("selectedRole", roleId);
    setLoadingRoleId(roleId);
    login();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Select Your Role</h2>
          <p className="text-base-content/60">Choose how you want to use Talent IQ, then sign in with Google</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isLoading = loadingRoleId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                disabled={!!loadingRoleId}
                className="card bg-base-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="card-body items-center text-center">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${role.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {isLoading ? (
                      <Loader2Icon className="size-8 text-white animate-spin" />
                    ) : (
                      <Icon className="size-8 text-white" />
                    )}
                  </div>
                  <h3 className="card-title text-lg">{role.name}</h3>
                  <p className="text-sm text-base-content/70">{role.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={onClose} className="btn btn-ghost" disabled={!!loadingRoleId}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionModal;
