import Problem from "../models/Problem.js";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listProblems(req, res) {
  try {
    const problems = await Problem.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.log("Error in listProblems controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// admin: include inactive
export async function listAllProblems(req, res) {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.log("Error in listAllProblems controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function validateSolvable(body) {
  if (!body.title) return "Title is required";
  if (!body.functionName) return "Function name is required";
  if (!body.starterCode?.javascript) return "JavaScript starter code is required";
  if (!Array.isArray(body.testCases) || body.testCases.length === 0) {
    return "At least one test case is required";
  }

  for (const tc of body.testCases) {
    try {
      JSON.parse(tc.input);
    } catch {
      return `Test case input is not valid JSON: ${tc.input}`;
    }
    try {
      JSON.parse(tc.output);
    } catch {
      return `Test case output is not valid JSON: ${tc.output}`;
    }
  }

  return null;
}

export async function createProblem(req, res) {
  try {
    const validationError = validateSolvable(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);

    const exists = await Problem.findOne({ slug });
    if (exists) return res.status(409).json({ message: "A problem with this slug already exists" });

    const problem = await Problem.create({
      ...req.body,
      slug,
      createdBy: req.user._id,
    });

    res.status(201).json({ problem });
  } catch (error) {
    console.log("Error in createProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProblem(req, res) {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    delete update.createdBy;
    if (update.slug) update.slug = slugify(update.slug);

    const problem = await Problem.findByIdAndUpdate(id, update, { new: true });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ problem });
  } catch (error) {
    console.log("Error in updateProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ message: "Problem deleted" });
  } catch (error) {
    console.log("Error in deleteProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
