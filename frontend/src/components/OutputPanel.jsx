function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <div>
            {output.testsPassed !== undefined && (
              <div
                className={`mb-2 font-semibold text-sm ${
                  output.testsPassed ? "text-success" : "text-error"
                }`}
              >
                {output.testsPassed ? "✓ All tests passed" : "✗ Some tests failed"}
              </div>
            )}
            <p className="text-xs opacity-60 mb-1">Your output:</p>
            <pre className="text-sm font-mono whitespace-pre-wrap mb-2">{output.output}</pre>
            {output.testsPassed === false && output.expectedOutput && (
              <>
                <p className="text-xs opacity-60 mb-1">Expected output:</p>
                <pre className="text-sm font-mono text-info whitespace-pre-wrap">
                  {output.expectedOutput}
                </pre>
              </>
            )}
          </div>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
