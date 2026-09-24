// Wraps a student's function with a per-language test harness so the solution is
// actually executed against the problem's hidden test cases, then compares the
// program's stdout to the problem's canonical expectedOutput.

// ---- Java literal/printing helpers (type-driven) ----
function javaLiteral(type, value) {
  switch (type) {
    case "int":
      return String(value);
    case "boolean":
      return value ? "true" : "false";
    case "string":
      return JSON.stringify(value); // produces "..."
    case "int[]":
      return `new int[]{${value.join(",")}}`;
    case "string[]":
      return `new String[]{${value.map((v) => JSON.stringify(v)).join(",")}}`;
    default:
      return "null";
  }
}

function javaPrintExpr(retType, expr) {
  switch (retType) {
    case "int":
    case "boolean":
      return `System.out.println(${expr});`;
    case "string":
      return `System.out.println("\\"" + ${expr} + "\\"");`;
    case "int[]":
      return `System.out.println(__ja(${expr}));`;
    case "string[]":
      return `System.out.println(__js(${expr}));`;
    default:
      return `System.out.println(${expr});`;
  }
}

const JAVA_HELPERS = `
    static String __ja(int[] x){StringBuilder b=new StringBuilder("[");for(int i=0;i<x.length;i++){if(i>0)b.append(",");b.append(x[i]);}b.append("]");return b.toString();}
    static String __js(String[] x){StringBuilder b=new StringBuilder("[");for(int i=0;i<x.length;i++){if(i>0)b.append(",");b.append("\\"").append(x[i]).append("\\"");}b.append("]");return b.toString();}`;

// ---- build runnable code per language ----
export function buildRunnableCode(language, studentCode, problem) {
  const { functionName, params, ret, tests } = problem;
  const testsJSON = JSON.stringify(tests);

  if (language === "javascript") {
    const harness = `\n;(function(){\n  const __tests = ${testsJSON};\n  for (const __t of __tests) { console.log(JSON.stringify(${functionName}(...__t))); }\n})();`;
    return studentCode + "\n" + harness;
  }

  if (language === "python") {
    const harness = `\nimport json as __json\n__tests = __json.loads('''${testsJSON}''')\nfor __t in __tests:\n    print(__json.dumps(${functionName}(*__t)))`;
    return studentCode + "\n" + harness;
  }

  if (language === "java") {
    const blocks = tests
      .map((args) => {
        const decls = args.map((v, i) => `${javaTypeOf(params[i])} __a${i} = ${javaLiteral(params[i], v)};`).join(" ");
        const call = `new Solution().${functionName}(${args.map((_, i) => `__a${i}`).join(", ")})`;
        return `        { ${decls} ${javaPrintExpr(ret, call)} }`;
      })
      .join("\n");

    const main = `\n    public static void main(String[] args) {\n${blocks}\n    }${JAVA_HELPERS}\n`;
    // inject main + helpers before the final closing brace of class Solution
    return studentCode.replace(/\}\s*$/, main + "}");
  }

  return studentCode;
}

function javaTypeOf(type) {
  return { "int": "int", "int[]": "int[]", "boolean": "boolean", "string": "String", "string[]": "String[]" }[type];
}

// ---- output normalization + comparison ----
export function normalizeOutput(output) {
  return output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        .replace(/\s*,\s*/g, ",")
    )
    .filter((line) => line.length > 0)
    .join("\n");
}

export function judgeOutput(actualOutput, expectedOutput) {
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
}
