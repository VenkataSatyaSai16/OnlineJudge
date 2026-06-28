function ProblemCard({ problem }) {
  const renderConstraints = (constraints) => {
    if (!constraints) return null;
    const items = constraints.split('\n').filter(c => c.trim() !== '');
    if (items.length > 0) {
      return items.map((item, idx) => (
        <span key={idx} className="constraint-badge">{item}</span>
      ));
    }
    return <span className="constraint-badge">{constraints}</span>;
  };

  return (
    <div className="problem-card">
      <h1 style={{marginTop: 0, fontSize: "28px", color: "var(--text-primary)", marginBottom: "24px"}}>{problem?.title}</h1>

      <div className="description">
        <h3 style={{marginBottom: "8px", color: "var(--text-primary)"}}>Description</h3>
        <p style={{marginTop: 0, marginBottom: "24px"}}>{problem?.description}</p>

        <h3 style={{marginBottom: "8px", color: "var(--text-primary)"}}>Input Format</h3>
        <p style={{marginTop: 0, marginBottom: "24px"}}>{problem?.inputFormat}</p>

        <h3 style={{marginBottom: "8px", color: "var(--text-primary)"}}>Output Format</h3>
        <p style={{marginTop: 0, marginBottom: "24px"}}>{problem?.outputFormat}</p>

        <h3 style={{marginBottom: "12px", color: "var(--text-primary)"}}>Constraints</h3>
        <div style={{marginBottom: "24px"}}>
          {renderConstraints(problem?.constraints)}
        </div>
      </div>

      <h3 style={{marginBottom: "12px", color: "var(--text-primary)"}}>Examples</h3>

      {problem?.examples?.map((example, index) => (
        <div className="examples" key={index}>
          <div style={{marginBottom: "12px"}}>
            <strong style={{color: "var(--text-secondary)", display: "block", marginBottom: "4px"}}>Input:</strong>
            <div style={{fontFamily: "inherit", whiteSpace: "pre-wrap"}}>{example.input}</div>
          </div>

          <div>
            <strong style={{color: "var(--text-secondary)", display: "block", marginBottom: "4px"}}>Output:</strong>
            <div style={{fontFamily: "inherit", whiteSpace: "pre-wrap"}}>{example.output}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProblemCard;