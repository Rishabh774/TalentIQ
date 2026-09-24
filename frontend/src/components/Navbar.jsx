import { Link, useLocation, useNavigate } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, ShieldIcon, LogOutIcon } from "lucide-react";
import { useCurrentDbUser } from "../hooks/useUser";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: dbUserData } = useCurrentDbUser();
  const role = dbUserData?.user?.role;

  const isActive = (path) => location.pathname === path;
  const dashboardPath = role === "admin" ? "/admin" : role === "interviewer" ? "/interviewer" : "/dashboard";

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          <Link
            to={dashboardPath}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200
              ${
                isActive(dashboardPath)
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {role === "admin" && (
            <Link
              to={"/admin"}
              className={`px-4 py-2.5 rounded-lg transition-all duration-200
                ${
                  isActive("/admin")
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }
                `}
            >
              <div className="flex items-center gap-x-2.5">
                <ShieldIcon className="size-4" />
                <span className="font-medium hidden sm:inline">Admin</span>
              </div>
            </Link>
          )}

          <div className="ml-2">
            <NotificationBell />
          </div>

          <div className="ml-2 dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-1 flex items-center justify-center bg-base-200 overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-sm font-bold">{initials}</span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-300"
            >
              <li className="menu-title">
                <span className="text-base-content/80 truncate">{user?.name}</span>
                <span className="text-xs font-normal text-base-content/50 truncate">{user?.email}</span>
              </li>
              <li>
                <button onClick={handleSignOut} className="text-error">
                  <LogOutIcon className="size-4" />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
