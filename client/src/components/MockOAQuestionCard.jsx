function MockOAQuestionCard({ problem }) {
  if (!problem) return null;

  const formatText = (text) => {
    if (!text) return null;
    return text.replace(/\\n/g, '\n');
  };

  return (
    <div className="problem-card">
      <h1>{problem.title}</h1>
      <span className={`diff-badge diff-${problem.difficulty?.toLowerCase()}`}>
        {problem.difficulty}
      </span>
      <div className="description">
        <h3 style={{marginBottom: "8px", color: "var(--text-primary)", fontWeight: "bold"}}>Description</h3>
        <p style={{marginTop: 0, marginBottom: "24px", whiteSpace: "pre-wrap"}}>{formatText(problem.description)}</p>
        
        <h3 style={{marginBottom: "8px", color: "var(--text-primary)", fontWeight: "bold"}}>Input Format</h3>
        <p style={{marginTop: 0, marginBottom: "24px", whiteSpace: "pre-wrap"}}>{formatText(problem.inputFormat)}</p>
        
        <h3 style={{marginBottom: "8px", color: "var(--text-primary)", fontWeight: "bold"}}>Output Format</h3>
        <p style={{marginTop: 0, marginBottom: "24px", whiteSpace: "pre-wrap"}}>{formatText(problem.outputFormat)}</p>
      </div>

      <h3 style={{marginBottom: "12px", color: "var(--text-primary)", fontWeight: "bold"}}>Examples</h3>
      {problem.examples?.map((example, index) => (
        <pre className="examples" key={index}>
{`Input:
${example.input}

Output:
${example.output}

${example.explanation || ""}`}
        </pre>
      ))}
      <h3 style={{marginBottom: "12px", color: "var(--text-primary)", marginTop: "24px", fontWeight: "bold"}}>Constraints</h3>
      <p style={{marginBottom: "24px", whiteSpace: "pre-wrap"}}>{formatText(problem.constraints)}</p>
    </div>
  );
}

export default MockOAQuestionCard;
