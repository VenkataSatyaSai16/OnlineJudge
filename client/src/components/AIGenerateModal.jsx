import { X } from "lucide-react";

function AIGenerateModal({ problem, onClose, onApply }) {
  if (!problem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-header">
          <h2>🤖 AI Generated Problem</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div className="ai-stat-grid">
            <div className="ai-stat-card">
              <div className="ai-stat-label">Title</div>
              <div className="ai-stat-value" style={{ fontSize: "1rem" }}>{problem.title}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Difficulty</div>
              <div className="ai-stat-value">{problem.difficulty}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Time/Space</div>
              <div className="ai-stat-value" style={{ fontSize: "0.9rem" }}>{problem.expectedTimeComplexity} / {problem.expectedSpaceComplexity}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Limits</div>
              <div className="ai-stat-value" style={{ fontSize: "0.9rem" }}>{problem.recommendedTimeLimit}ms / {problem.recommendedMemoryLimit}MB</div>
            </div>
          </div>

          <div className="ai-section">
            <h4>Topics</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {problem.topics.map((t, idx) => (
                <span key={idx} style={{ padding: "4px 8px", background: "var(--bg-secondary)", borderRadius: "4px", fontSize: "0.85rem" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="ai-section">
            <h4>Description</h4>
            <pre style={{ whiteSpace: "pre-wrap", background: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", fontFamily: "inherit" }}>
              {problem.description}
            </pre>
          </div>

          <div className="ai-section">
            <h4>Constraints</h4>
            <pre style={{ whiteSpace: "pre-wrap", background: "var(--bg-secondary)", padding: "12px", borderRadius: "6px", fontFamily: "inherit" }}>
              {problem.constraints}
            </pre>
          </div>

          <div className="ai-section">
            <h4>Editorial Summary</h4>
            <p style={{ marginTop: "8px", color: "var(--text-secondary)" }}>{problem.editorialSummary}</p>
          </div>

          <div className="ai-section">
            <h4>Generated Test Cases</h4>
            <p className="muted" style={{ marginBottom: "12px" }}>
              {problem.examples?.length || 0} visible examples, {problem.testCases?.filter(t => t.isHidden)?.length || 0} hidden cases
            </p>
          </div>

        </div>
        
        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onApply(problem)}>
            Apply to Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIGenerateModal;
