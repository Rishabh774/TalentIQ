import { ClockIcon } from "lucide-react";
import { useActiveSessions, useMyRecentSessions } from "../hooks/useSessions";
import { useCurrentDbUser } from "../hooks/useUser";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import GamificationPanel from "../components/GamificationPanel";
import Leaderboard from "../components/Leaderboard";
import DailyChallengeCard from "../components/DailyChallengeCard";

function DashboardPage() {
  const { user } = useAuth();
  const { data: dbUserData } = useCurrentDbUser();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const interviewerRequested = dbUserData?.user?.interviewerRequested;

  const isUserInSession = (session) => {
    const myGoogleId = user?.googleId;
    if (!myGoogleId) return false;
    return session.host?.googleId === myGoogleId || session.participant?.googleId === myGoogleId;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection />

        {interviewerRequested && (
          <div className="container mx-auto px-6 -mt-4 mb-4">
            <div className="alert alert-warning shadow-md">
              <ClockIcon className="size-5" />
              <span>
                Your interviewer access request is pending. Admin will approve you as an
                interviewer soon — until then you can keep practicing as a student.
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <div className="mt-6">
            <DailyChallengeCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <GamificationPanel />
            <Leaderboard />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
