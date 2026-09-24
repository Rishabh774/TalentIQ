// Verifies the judge harness by running CORRECT and WRONG solutions through the
// real per-language pipeline (node/python/java) and checking pass/fail.
import { execFileSync } from "child_process";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { buildRunnableCode, judgeOutput } from "../src/lib/judge.js";
import { PROBLEMS } from "../src/data/problems.js";

const PY = process.env.PYTHON_EXECUTABLE || "python";

function run(language, code) {
  const dir = mkdtempSync(path.join(tmpdir(), "judge-"));
  try {
    if (language === "javascript") {
      const f = path.join(dir, "main.js");
      writeFileSync(f, code);
      return execFileSync("node", [f], { encoding: "utf8" });
    }
    if (language === "python") {
      const f = path.join(dir, "main.py");
      writeFileSync(f, code);
      return execFileSync(PY, [f], { encoding: "utf8" });
    }
    if (language === "java") {
      const f = path.join(dir, "Solution.java");
      writeFileSync(f, code);
      execFileSync("javac", [f], { cwd: dir });
      return execFileSync("java", ["-cp", dir, "Solution"], { encoding: "utf8" });
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// correct solutions keyed by problem id (use the first/fixed instance of each archetype)
const SOLUTIONS = {
  "two-sum": {
    javascript: `function twoSum(a, b){const m=new Map();for(let i=0;i<a.length;i++){if(m.has(b-a[i]))return [m.get(b-a[i]),i];m.set(a[i],i);}return [];}`,
    python: `def twoSum(a, b):\n    m={}\n    for i,x in enumerate(a):\n        if b-x in m: return [m[b-x], i]\n        m[x]=i\n    return []`,
    java: `class Solution {\n    public int[] twoSum(int[] a, int b){\n        java.util.HashMap<Integer,Integer> m=new java.util.HashMap<>();\n        for(int i=0;i<a.length;i++){ if(m.containsKey(b-a[i])) return new int[]{m.get(b-a[i]),i}; m.put(a[i],i);} return new int[0];\n    }\n}`,
  },
  "reverse-string": {
    javascript: `function reverseString(a){return a.split("").reverse().join("");}`,
    python: `def reverseString(a):\n    return a[::-1]`,
    java: `class Solution {\n    public String reverseString(String a){ return new StringBuilder(a).reverse().toString(); }\n}`,
  },
  "is-prime": {
    javascript: `function isPrime(a){if(a<2)return false;for(let i=2;i*i<=a;i++)if(a%i===0)return false;return true;}`,
    python: `def isPrime(a):\n    if a<2: return False\n    i=2\n    while i*i<=a:\n        if a%i==0: return False\n        i+=1\n    return True`,
    java: `class Solution {\n    public boolean isPrime(int a){ if(a<2)return false; for(int i=2;(long)i*i<=a;i++) if(a%i==0) return false; return true; }\n}`,
  },
  "maximum-subarray": {
    javascript: `function maxSubArray(a){let best=a[0],cur=a[0];for(let i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);best=Math.max(best,cur);}return best;}`,
    python: `def maxSubArray(a):\n    best=cur=a[0]\n    for x in a[1:]:\n        cur=max(x,cur+x); best=max(best,cur)\n    return best`,
    java: `class Solution {\n    public int maxSubArray(int[] a){ int best=a[0],cur=a[0]; for(int i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);best=Math.max(best,cur);} return best; }\n}`,
  },
  "move-zeroes": {
    javascript: `function moveZeroes(a){const nz=a.filter(x=>x!==0);while(nz.length<a.length)nz.push(0);return nz;}`,
    python: `def moveZeroes(a):\n    nz=[x for x in a if x!=0]\n    return nz+[0]*(len(a)-len(nz))`,
    java: `class Solution {\n    public int[] moveZeroes(int[] a){ int[] r=new int[a.length]; int j=0; for(int x:a) if(x!=0) r[j++]=x; return r; }\n}`,
  },
  "is-anagram": {
    javascript: `function isAnagram(a,b){return a.split("").sort().join("")===b.split("").sort().join("");}`,
    python: `def isAnagram(a,b):\n    return sorted(a)==sorted(b)`,
    java: `class Solution {\n    public boolean isAnagram(String a,String b){ char[] x=a.toCharArray(),y=b.toCharArray(); java.util.Arrays.sort(x); java.util.Arrays.sort(y); return java.util.Arrays.equals(x,y); }\n}`,
  },
};

const WRONG = {
  javascript: (fn) => `function ${fn}(){return null;}`,
  python: (fn) => `def ${fn}(*a):\n    return None`,
  java: null, // skip wrong-test for java (type system)
};

let pass = 0, fail = 0;
for (const [id, sols] of Object.entries(SOLUTIONS)) {
  const problem = PROBLEMS[id];
  if (!problem) { console.log(`SKIP ${id} (not found)`); continue; }

  for (const lang of ["javascript", "python", "java"]) {
    // correct solution should PASS
    try {
      const code = buildRunnableCode(lang, sols[lang], problem);
      const out = run(lang, code);
      const ok = judgeOutput(out, problem.expectedOutput);
      if (ok) { pass++; console.log(`PASS  ${id} [${lang}] correct`); }
      else { fail++; console.log(`FAIL  ${id} [${lang}] correct -> got:\n${out}\nexpected:\n${problem.expectedOutput}`); }
    } catch (e) {
      fail++; console.log(`ERROR ${id} [${lang}] correct: ${e.message.split("\n")[0]}`);
    }

    // wrong solution should FAIL the judge
    if (WRONG[lang]) {
      try {
        const code = buildRunnableCode(lang, WRONG[lang](problem.functionName), problem);
        const out = run(lang, code);
        const ok = judgeOutput(out, problem.expectedOutput);
        if (!ok) { pass++; console.log(`PASS  ${id} [${lang}] wrong-rejected`); }
        else { fail++; console.log(`FAIL  ${id} [${lang}] wrong accepted!`); }
      } catch {
        // a wrong solution that throws is still correctly NOT accepted
        pass++; console.log(`PASS  ${id} [${lang}] wrong-rejected (runtime error)`);
      }
    }
  }
}

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
process.exit(fail > 0 ? 1 : 0);
