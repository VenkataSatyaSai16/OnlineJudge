function VerdictCard({
  input,
  output,
  verdict,

  runStatus,
  submitStatus,

  handleInputChange,

  run,
  submit,
}) {

  return (
    <div className="verdict-card">

      <div className="verdict-sections">
        <div className="verdict-box">
          <strong>
            Custom Input
          </strong>
          <textarea
            className="form-input"
            rows="5"
            value={input}
            onChange={
              handleInputChange
            }
          />
        </div>

        <div className="verdict-box">
          <strong>
            Output
          </strong>
          <pre style={{margin: 0}}>
            {output}
          </pre>
        </div>

        <div className="verdict-box">
          <strong>
            Verdict
          </strong>
          <p style={{margin: 0, color: "var(--diff-medium)"}}>
            {verdict}
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-run"
          onClick={run}
          disabled={runStatus}
        >
          {runStatus
            ? "Running..."
            : "Run"}
        </button>

        <button
          className="btn btn-submit"
          onClick={submit}
          disabled={
            submitStatus
          }
        >
          {submitStatus
            ? "Submitting..."
            : "Submit"}
        </button>

        <button className="btn btn-ai" disabled>
          AI Review
        </button>
      </div>

    </div>
  );
}

export default VerdictCard;