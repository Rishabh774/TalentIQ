import { useState } from "react";
import { useSubmitFeedback } from "../hooks/useFeedback";

const RECOMMENDATIONS = [
  { value: "strong_yes", label: "Strong Yes" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "strong_no", label: "Strong No" },
];

function EvaluationForm({ sessionId, candidateId, onSubmitted }) {
  const [technicalFeedback, setTechnicalFeedback] = useState("");
  const [communicationFeedback, setCommunicationFeedback] = useState("");
  const [hiringRecommendation, setHiringRecommendation] = useState("");
  const [overallRating, setOverallRating] = useState(0);

  const submitFeedbackMutation = useSubmitFeedback();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hiringRecommendation || !overallRating) return;

    submitFeedbackMutation.mutate(
      { sessionId, candidateId, technicalFeedback, communicationFeedback, hiringRecommendation, overallRating },
      { onSuccess: onSubmitted }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 p-6 space-y-4">
      <h3 className="text-lg font-bold">Candidate Evaluation</h3>

      <div>
        <label className="label text-sm font-medium">Technical Feedback</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          value={technicalFeedback}
          onChange={(e) => setTechnicalFeedback(e.target.value)}
        />
      </div>

      <div>
        <label className="label text-sm font-medium">Communication Feedback</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          value={communicationFeedback}
          onChange={(e) => setCommunicationFeedback(e.target.value)}
        />
      </div>

      <div>
        <label className="label text-sm font-medium">Hiring Recommendation</label>
        <select
          className="select select-bordered w-full"
          value={hiringRecommendation}
          onChange={(e) => setHiringRecommendation(e.target.value)}
        >
          <option value="">Select...</option>
          {RECOMMENDATIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label text-sm font-medium">Overall Rating (1-5)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setOverallRating(n)}
              className={`btn btn-sm ${overallRating === n ? "btn-primary" : "btn-outline"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={submitFeedbackMutation.isPending || !hiringRecommendation || !overallRating}
      >
        Submit Evaluation
      </button>
    </form>
  );
}

export default EvaluationForm;
