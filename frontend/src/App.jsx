import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import InterviewerDashboardPage from "./pages/InterviewerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { useCurrentDbUser, useSetMyRole } from "./hooks/useUser";
import { useAuth } from "./context/AuthContext";

function dashboardPathForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "interviewer") return "/interviewer";
  return "/dashboard";
}

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const setMyRoleMutation = useSetMyRole();
  const appliedPreselectedRole = useRef(false);

  const { data: dbUserData, isLoading: loadingDbUser } = useCurrentDbUser({
    enabled: isLoaded && isSignedIn,
  });

  const dbUser = dbUserData?.user;
  const needsRoleSelection = isSignedIn && dbUser && !dbUser.roleSet;

  useEffect(() => {
    if (!needsRoleSelection || appliedPreselectedRole.current) return;

    const preselectedRole = sessionStorage.getItem("selectedRole");
    if (!preselectedRole) return;

    appliedPreselectedRole.current = true;
    sessionStorage.removeItem("selectedRole");

    const roleToApply = preselectedRole === "interviewer" ? "interviewer" : "student";
    setMyRoleMutation.mutate(roleToApply);
  }, [needsRoleSelection, setMyRoleMutation]);

  if (!isLoaded || (isSignedIn && loadingDbUser)) return null;

  const homeDashboard = dbUser ? dashboardPathForRole(dbUser.role) : "/dashboard";

  const requireRole = (allowedRoles, element) => {
    if (!isSignedIn) return <Navigate to="/" />;
    if (!dbUser) return <Navigate to="/" />;
    if (needsRoleSelection) return <Navigate to="/select-role" />;
    if (!allowedRoles.includes(dbUser.role)) return <Navigate to={homeDashboard} />;
    return element;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={homeDashboard} />} />

        <Route
          path="/select-role"
          element={isSignedIn && needsRoleSelection ? <RoleSelectionPage /> : <Navigate to={homeDashboard} />}
        />

        <Route path="/dashboard" element={requireRole(["student"], <DashboardPage />)} />
        <Route path="/interviewer" element={requireRole(["interviewer", "admin"], <InterviewerDashboardPage />)} />
        <Route path="/admin" element={requireRole(["admin"], <AdminDashboardPage />)} />

        <Route
          path="/problems"
          element={isSignedIn ? (needsRoleSelection ? <Navigate to="/select-role" /> : <ProblemsPage />) : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={isSignedIn ? (needsRoleSelection ? <Navigate to="/select-role" /> : <ProblemPage />) : <Navigate to={"/"} />}
        />
        <Route
          path="/session/:id"
          element={isSignedIn ? (needsRoleSelection ? <Navigate to="/select-role" /> : <SessionPage />) : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
