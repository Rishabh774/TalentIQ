// Smoke-checks all 100 problems: each must have non-empty tests/expectedOutput,
// valid starter code per language, and unique id/title/functionName.
import { PROBLEMS } from "../src/data/problems.js";

const entries = Object.entries(PROBLEMS);
console.log(`Total problems: ${entries.length}`);

let errors = 0;
const seenIds = new Set();
const seenTitles = new Set();
const seenFn = new Set();

for (const [id, p] of entries) {
  if (seenIds.has(id)) { console.log(`DUPLICATE id: ${id}`); errors++; }
  seenIds.add(id);

  if (seenTitles.has(p.title)) { console.log(`DUPLICATE title: ${p.title}`); errors++; }
  seenTitles.add(p.title);

  if (seenFn.has(p.functionName)) { console.log(`DUPLICATE functionName: ${p.functionName} (${id})`); errors++; }
  seenFn.add(p.functionName);

  if (!p.tests || p.tests.length === 0) { console.log(`NO TESTS: ${id}`); errors++; }
  if (!p.expectedOutput) { console.log(`NO expectedOutput: ${id}`); errors++; }
  if (!p.starterCode?.javascript || !p.starterCode?.python || !p.starterCode?.java) {
    console.log(`MISSING starterCode: ${id}`); errors++;
  }
  if (!["Easy", "Medium", "Hard"].includes(p.difficulty)) { console.log(`BAD difficulty: ${id}`); errors++; }
}

const counts = {
  Easy: entries.filter(([, p]) => p.difficulty === "Easy").length,
  Medium: entries.filter(([, p]) => p.difficulty === "Medium").length,
  Hard: entries.filter(([, p]) => p.difficulty === "Hard").length,
};
console.log("By difficulty:", counts);
console.log(errors === 0 ? "\nALL CHECKS PASSED" : `\n${errors} ERRORS FOUND`);
process.exit(errors > 0 ? 1 : 0);
