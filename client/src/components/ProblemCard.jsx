function ProblemCard({ problem }) {
  return (
    <div className="problem-card">

      <h1 style={{marginTop: 0, fontSize: "24px", color: "var(--text-primary)", marginBottom: "16px"}}>{problem?.title}</h1>

      <div className="description">
        <h3>Description</h3>
        <p>{problem?.description}</p>

        <h3>Input Format</h3>
        <p>{problem?.inputFormat}</p>

        <h3>Output Format</h3>
        <p>{problem?.outputFormat}</p>

        <h3>Constraints</h3>
        <p>{problem?.constraints}</p>
      </div>

      <h3>Examples</h3>

      {problem?.examples?.map(
        (example, index) => (
          <div className="examples" key={index}>
            <p style={{margin: "0 0 8px 0"}}>
              <b>Input:</b><br/>
              {example.input}
            </p>

            <p style={{margin: 0}}>
              <b>Output:</b><br/>
              {example.output}
            </p>
          </div>
        )
      )}

    </div>
  );
}

export default ProblemCard;