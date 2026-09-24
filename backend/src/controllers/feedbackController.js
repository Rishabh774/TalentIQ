import Feedback from "../models/Feedback.js";
import Session from "../models/Session.js";

export async function submitFeedback(req, res) {
  try {
    const { sessionId, candidateId, technicalFeedback, communicationFeedback, hiringRecommendation, overallRating } =
      req.body;

    if (!sessionId || !candidateId || !hiringRecommendation || !overallRating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const feedback = await Feedback.findOneAndUpdate(
      { session: sessionId, interviewer: req.user._id },
      {
        session: sessionId,
        interviewer: req.user._id,
        candidate: candidateId,
        technicalFeedback,
        communicationFeedback,
        hiringRecommendation,
        overallRating,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ feedback });
  } catch (error) {
    console.log("Error in submitFeedback controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFeedbackForSession(req, res) {
  try {
    const { sessionId } = req.params;
    const feedback = await Feedback.find({ session: sessionId }).populate(
      "interviewer candidate",
      "name email profileImage"
    );
    res.status(200).json({ feedback });
  } catch (error) {
    console.log("Error in getFeedbackForSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyGivenFeedback(req, res) {
  try {
    const feedback = await Feedback.find({ interviewer: req.user._id })
      .populate("candidate", "name email profileImage")
      .populate("session", "problem difficulty createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ feedback });
  } catch (error) {
    console.log("Error in getMyGivenFeedback controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
