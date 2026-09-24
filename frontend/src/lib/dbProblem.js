// Converts an admin-created Problem (from MongoDB) into the same shape the
// static PROBLEMS dataset uses, so it can flow through ProblemPage/judge.js
// unchanged. Admin-created problems are JavaScript-only.
export function toJudgeProblem(dbProblem) {
  return {
    id: dbProblem.slug,
    title: dbProblem.title,
    difficulty: dbProblem.difficulty,
    category: dbProblem.category,
    topic: dbProblem.topic,
    companies: dbProblem.companies || [],
    frequency: dbProblem.frequency,
    description: {
      text: dbProblem.description || "",
      notes: dbProblem.descriptionNotes || [],
    },
    examples: dbProblem.examples || [],
    constraints: dbProblem.constraints || [],
    functionName: dbProblem.functionName,
    params: [],
    ret: undefined,
    tests: (dbProblem.testCases || []).map((tc) => JSON.parse(tc.input)),
    expectedOutput: (dbProblem.testCases || []).map((tc) => tc.output).join("\n"),
    starterCode: {
      javascript: dbProblem.starterCode?.javascript || "",
    },
  };
}
