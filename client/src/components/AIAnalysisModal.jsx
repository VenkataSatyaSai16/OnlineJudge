import { X } from "lucide-react";

function AIAnalysisModal({ analysis, onClose, onApply }) {
  if (!analysis) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h2>🤖 AI Analysis</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="ai-stat-grid" style={{ marginBottom: "20px" }}>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Difficulty</div>
              <div className="ai-stat-value">{analysis.difficulty}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Confidence</div>
              <div className="ai-stat-value">{analysis.confidence}%</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Expected Time</div>
              <div className="ai-stat-value">{analysis.expectedTimeComplexity}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Expected Space</div>
              <div className="ai-stat-value">{analysis.expectedSpaceComplexity}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Time Limit</div>
              <div className="ai-stat-value">{analysis.recommendedTimeLimit} ms</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Memory Limit</div>
              <div className="ai-stat-value">{analysis.recommendedMemoryLimit} MB</div>
            </div>
          </div>
          
          <div className="ai-section" style={{ marginBottom: "20px" }}>
            <h4>Topics</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {analysis.topics.map((t, idx) => (
                <span key={idx} style={{ padding: "4px 8px", background: "var(--bg-secondary)", borderRadius: "4px", fontSize: "0.85rem" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="ai-section" style={{ marginBottom: "20px" }}>
            <h4>Reasoning</h4>
            <p style={{ marginTop: "8px", color: "var(--text-secondary)" }}>{analysis.reasoning}</p>
          </div>
        </div>
        
        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onApply(analysis)}>
            Apply Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAnalysisModal;
