import { PROBLEMS } from "./problems";

export const COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Uber", "Netflix", "Adobe"];

export const FREQUENCIES = ["High", "Medium", "Low"];

// per-problem company-bank metadata. Keep ids in sync with PROBLEMS.
const QUESTION_META = {
  "two-sum": {
    topic: "Array",
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Adobe"],
    frequency: "High",
  },
  "reverse-string": {
    topic: "String",
    companies: ["Amazon", "Microsoft"],
    frequency: "Low",
  },
  "valid-palindrome": {
    topic: "String",
    companies: ["Meta", "Amazon", "Uber"],
    frequency: "Medium",
  },
  "maximum-subarray": {
    topic: "Dynamic Programming",
    companies: ["Amazon", "Microsoft", "Netflix", "Google"],
    frequency: "High",
  },
  "container-with-most-water": {
    topic: "Two Pointers",
    companies: ["Google", "Meta", "Uber", "Adobe"],
    frequency: "Medium",
  },
};

// build a flat list joining problem details with bank metadata
export const COMPANY_QUESTIONS = Object.entries(QUESTION_META)
  .filter(([id]) => PROBLEMS[id])
  .map(([id, meta]) => ({
    id,
    title: PROBLEMS[id].title,
    difficulty: PROBLEMS[id].difficulty,
    category: PROBLEMS[id].category,
    topic: meta.topic,
    companies: meta.companies,
    frequency: meta.frequency,
  }));

export const TOPICS = [...new Set(COMPANY_QUESTIONS.map((q) => q.topic))].sort();
