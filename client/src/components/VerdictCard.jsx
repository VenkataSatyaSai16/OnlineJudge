import useAuth from "../hooks/useAuth";

function VerdictCard({
  input,
  output,
  verdict,
  passedTestCases,
  runStatus,
  submitStatus,
  reviewStatus,
  hasSubmitted,
  reviewResult,
  error,
  handleInputChange,
  run,
  submit,
  review,
  totalTestCases,
}) {
  const { isAuthenticated } = useAuth();

  const getVerdictBadgeClass = (verdictStr) => {
    if (!verdictStr) return "";
    const v = verdictStr.toLowerCase();
    if (v.includes("accepted")) return "verdict-badge badge-accepted";
    if (v.includes("wrong")) return "verdict-badge badge-wrong";
    if (v.includes("time limit") || v.includes("tle")) return "verdict-badge badge-tle";
    if (v.includes("memory limit") || v.includes("mle")) return "verdict-badge badge-mle";
    if (v.includes("runtime error") || v.includes("error")) return "verdict-badge badge-runtime";
    return "verdict-badge badge-pending";
  };

  const getVerdictBoxStyle = (verdictStr, passed) => {
    if (!verdictStr) return {};
    const v = verdictStr.toLowerCase();
    if (v.includes("accepted") || v.includes("success")) {
      return { 
        backgroundColor: "color-mix(in srgb, var(--success) 14%, transparent)", 
        borderColor: "var(--success)", 
        color: "var(--success)" 
      };
    }
    if (passed > 0) {
      return { 
        backgroundColor: "color-mix(in srgb, var(--warning) 14%, transparent)", 
        borderColor: "var(--warning)", 
        color: "var(--warning)" 
      };
    }
    return { 
      backgroundColor: "color-mix(in srgb, var(--destructive) 14%, transparent)", 
      borderColor: "var(--destructive)", 
      color: "var(--destructive)" 
    };
  };

  const isPending = runStatus || submitStatus || reviewStatus;

  return (
    <div className="verdict-card">
      <div className="verdict-sections">
        <div className="verdict-box">
          <strong>Custom Input</strong>
          <textarea
            className="form-input"
            rows="5"
            value={input}
            onChange={handleInputChange}
            style={{fontFamily: "inherit"}}
          />
        </div>

        <div className="verdict-box">
          <strong>Output</strong>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{output}</pre>
        </div>

        <div className="verdict-box" style={getVerdictBoxStyle(verdict, passedTestCases)}>
          <strong style={{ color: verdict ? "inherit" : undefined }}>Verdict</strong>
          <div style={{marginTop: "8px", fontWeight: "600"}}>
            {verdict ? (
              <span>
                {verdict}
                {totalTestCases > 0 && (
                  <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "var(--text-secondary)" }}>
                    ({passedTestCases}/{totalTestCases} passed)
                  </span>
                )}
              </span>
            ) : (
              <span style={{ color: "var(--text-secondary)" }}>Not run yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-run"
          onClick={run}
          disabled={!isAuthenticated || isPending}
        >
          {runStatus ? "Running..." : "▶ Run"}
        </button>

        <button className="btn btn-submit" onClick={submit} disabled={!isAuthenticated || isPending}>
          {submitStatus ? "Submitting..." : "☁ Submit"}
        </button>

        {review && (
          <button
            className="btn btn-ai"
            onClick={review}
            disabled={!isAuthenticated || !hasSubmitted || isPending}
          >
            {reviewStatus ? "Reviewing..." : "✨ AI Review"}
          </button>
        )}
      </div>

      {error && (
        <div className="state-box state-error">
          {error}
        </div>
      )}


    </div>
  );
}

export default VerdictCard;
