import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technicalFeedback: {
      type: String,
      default: "",
    },
    communicationFeedback: {
      type: String,
      default: "",
    },
    hiringRecommendation: {
      type: String,
      enum: ["strong_yes", "yes", "no", "strong_no"],
      required: true,
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ session: 1, interviewer: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
