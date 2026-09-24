import { ENV } from "../lib/env.js";

const PISTON_API = ENV.PISTON_URL;

const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

const FILE_NAMES = {
  javascript: "main.js",
  python: "main.py",
  java: "Solution.java",
};

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;

    if (!language || typeof code !== "string") {
      return res.status(400).json({ success: false, error: "Language and code are required" });
    }

    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
      return res.status(400).json({ success: false, error: `Unsupported language: ${language}` });
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ name: FILE_NAMES[language], content: code }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      // emkc.org's public Piston went whitelist-only on 2026-02-15 and answers 401/403
      // for every execute call, so point PISTON_URL at your own instance instead.
      const needsOwnInstance =
        (response.status === 401 || response.status === 403) && PISTON_API.includes("emkc.org");

      return res.status(502).json({
        success: false,
        error: needsOwnInstance
          ? "Code execution is not configured: the public Piston API no longer accepts requests. Set PISTON_URL to a self-hosted Piston instance."
          : `Execution service error: ${response.status} ${errorText}`,
      });
    }

    const data = await response.json();
    const run = data.run || {};
    const stderr = run.stderr || "";
    const stdout = run.stdout || "";

    if (stderr) {
      return res.status(200).json({ success: false, output: stdout, error: stderr });
    }

    res.status(200).json({ success: true, output: stdout || "No output" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Code execution failed" });
  }
}
