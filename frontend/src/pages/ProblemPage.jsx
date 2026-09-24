import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import { buildRunnableCode, judgeOutput } from "../lib/judge";
import { toJudgeProblem } from "../lib/dbProblem";
import { useRecordSolved } from "../hooks/useProgress";
import { useTodayChallenge, useCompleteDailyChallenge } from "../hooks/useDailyChallenge";
import { useProblems } from "../hooks/useProblems";
import { useIsMobile } from "../hooks/useIsMobile";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: dbProblemsData } = useProblems();

  // admin-created problems (JS-only) merged alongside the static dataset
  const dbProblems = useMemo(
    () => (dbProblemsData?.problems || []).map(toJudgeProblem),
    [dbProblemsData]
  );
  const allProblems = useMemo(
    () => ({ ...PROBLEMS, ...Object.fromEntries(dbProblems.map((p) => [p.id, p])) }),
    [dbProblems]
  );

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = allProblems[currentProblemId];
  const availableLanguages = Object.keys(currentProblem?.starterCode || { javascript: "" });
  const recordSolvedMutation = useRecordSolved();
  const { data: dailyChallengeData } = useTodayChallenge();
  const completeDailyMutation = useCompleteDailyChallenge();

  // update problem when URL param changes
  useEffect(() => {
    if (!id || !allProblems[id]) return;

    const problem = allProblems[id];
    const lang = problem.starterCode[selectedLanguage] ? selectedLanguage : "javascript";

    setCurrentProblemId(id);
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang]);
    setOutput(null);
  }, [id, allProblems, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    // wrap the student's function with a test harness so the solution is
    // actually executed against this problem's hidden test cases
    const runnable = buildRunnableCode(selectedLanguage, code, currentProblem);
    const result = await executeCode(selectedLanguage, runnable);
    setIsRunning(false);

    // check if code executed successfully and matches expected output
    if (result.success) {
      const testsPassed = judgeOutput(result.output, currentProblem.expectedOutput);
      setOutput({ ...result, testsPassed, expectedOutput: currentProblem.expectedOutput });

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
        recordSolvedMutation.mutate({
          problemId: currentProblemId,
          difficulty: currentProblem.difficulty?.toLowerCase() || "easy",
          language: selectedLanguage,
        });

        // if this is today's daily challenge, claim the bonus
        if (
          dailyChallengeData?.challenge?.problemId === currentProblemId &&
          !dailyChallengeData?.completed
        ) {
          completeDailyMutation.mutate(currentProblemId);
        }
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      setOutput(result);
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1 min-h-0">
        <PanelGroup key={isMobile ? "mobile" : "desktop"} direction={isMobile ? "vertical" : "horizontal"}>
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={20}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(allProblems)}
            />
          </Panel>

          <PanelResizeHandle
            className={
              isMobile
                ? "h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize"
                : "w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize"
            }
          />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={20}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={20}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  availableLanguages={availableLanguages}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={20}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
