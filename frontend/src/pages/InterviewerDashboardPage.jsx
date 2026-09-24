import { useState } from "react";
import { useNavigate } from "react-router";
import { LoaderIcon, PlusIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import EvaluationForm from "../components/EvaluationForm";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useMyGivenFeedback } from "../hooks/useFeedback";

function InterviewerDashboardPage() {
  const navigate = useNavigate();
  const [evaluatingSession, setEvaluatingSession] = useState(null);

  const { data: activeSessionsData, isLoading: loadingActive } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecent } = useMyRecentSessions();
  const { data: feedbackData } = useMyGivenFeedback();
  const createSessionMutation = useCreateSession();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const givenFeedback = feedbackData?.feedback || [];

  const handleCreateSession = () => {
    // session is created with no problem yet - the host picks one once inside the session
    createSessionMutation.mutate(
      {},
      {
        onSuccess: (data) => navigate(`/session/${data.session._id}`),
      }
    );
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="container mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Interviewer Dashboard</h1>
          <button
            className="btn btn-primary gap-2"
            onClick={handleCreateSession}
            disabled={createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            Create Session
          </button>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-4">Live / Active Interview Sessions</h2>
          {loadingActive ? (
            <p className="text-base-content/60">Loading...</p>
          ) : activeSessions.length === 0 ? (
            <p className="text-base-content/60">No active sessions right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeSessions.map((session) => (
                <div key={session._id} className="card bg-base-100 p-4">
                  <p className="font-semibold">{session.problem || "No problem selected yet"}</p>
                  <p className="text-sm text-base-content/60 capitalize">{session.difficulty}</p>
                  <button
                    className="btn btn-sm btn-primary mt-3"
                    onClick={() => navigate(`/session/${session._id}`)}
                  >
                    Join as Interviewer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Completed Interviews — Submit Feedback</h2>
          {loadingRecent ? (
            <p className="text-base-content/60">Loading...</p>
          ) : recentSessions.length === 0 ? (
            <p className="text-base-content/60">No completed interviews yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentSessions.map((session) => (
                <div key={session._id} className="card bg-base-100 p-4">
                  <p className="font-semibold">{session.problem}</p>
                  <p className="text-sm text-base-content/60 capitalize">{session.difficulty}</p>
                  <button
                    className="btn btn-sm btn-secondary mt-3"
                    onClick={() => setEvaluatingSession(session)}
                  >
                    Evaluate Candidate
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {evaluatingSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-lg w-full">
              <EvaluationForm
                sessionId={evaluatingSession._id}
                candidateId={evaluatingSession.participant?._id || evaluatingSession.participant}
                onSubmitted={() => setEvaluatingSession(null)}
              />
              <button
                className="btn btn-ghost btn-sm w-full mt-2"
                onClick={() => setEvaluatingSession(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Feedback History</h2>
          {givenFeedback.length === 0 ? (
            <p className="text-base-content/60">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {givenFeedback.map((fb) => (
                <div key={fb._id} className="card bg-base-100 p-4">
                  <p className="font-semibold">{fb.session?.problem}</p>
                  <p className="text-sm">
                    Candidate: {fb.candidate?.name} — Rating: {fb.overallRating}/5 —{" "}
                    {fb.hiringRecommendation.replace("_", " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default InterviewerDashboardPage;
