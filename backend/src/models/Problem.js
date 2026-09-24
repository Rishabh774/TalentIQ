import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    category: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    // company-bank metadata
    companies: [{ type: String }],
    topic: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // fields below make the problem solvable in the code editor/judge (JavaScript only)
    descriptionNotes: [{ type: String }],
    functionName: {
      type: String,
      default: "",
    },
    starterCode: {
      javascript: {
        type: String,
        default: "",
      },
    },
    examples: [
      {
        input: { type: String, default: "" },
        output: { type: String, default: "" },
        explanation: { type: String, default: "" },
      },
    ],
    constraints: [{ type: String }],
    // each testCase.input is a JSON array literal of the function's arguments,
    // e.g. "[2, 3]"; each output is the JSON-stringified expected return value, e.g. "5"
    testCases: [
      {
        input: { type: String, default: "" },
        output: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
