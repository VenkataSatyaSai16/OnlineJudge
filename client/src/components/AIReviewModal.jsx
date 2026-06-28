import { X } from "lucide-react";

function AIReviewModal({ reviewResult, onClose }) {
  if (!reviewResult) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-header">
          <h2>🤖 AI Review Dashboard</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="ai-stat-grid" style={{ marginBottom: "20px" }}>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Correctness</div>
              <div className="ai-stat-value">{reviewResult.correctness}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Confidence</div>
              <div className="ai-stat-value">{reviewResult.confidence}%</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Time Complexity</div>
              <div className="ai-stat-value">{reviewResult.timeComplexity}</div>
            </div>
            <div className="ai-stat-card">
              <div className="ai-stat-label">Space Complexity</div>
              <div className="ai-stat-value">{reviewResult.spaceComplexity}</div>
            </div>
          </div>

          <div className="ai-section" style={{ marginBottom: "20px" }}>
            <h4>📝 Summary</h4>
            <p style={{ marginTop: "8px", color: "var(--text-secondary)" }}>{reviewResult.summary}</p>
          </div>

          {reviewResult.strengths?.length > 0 && (
            <div className="ai-section" style={{ marginBottom: "20px" }}>
              <h4>✅ Strengths</h4>
              <ul style={{ marginTop: "8px", color: "var(--text-secondary)", paddingLeft: "20px" }}>
                {reviewResult.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {reviewResult.issues?.length > 0 && (
            <div className="ai-section" style={{ marginBottom: "20px" }}>
              <h4>⚠️ Issues</h4>
              <ul style={{ marginTop: "8px", color: "var(--text-secondary)", paddingLeft: "20px" }}>
                {reviewResult.issues.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {reviewResult.edgeCases?.length > 0 && (
            <div className="ai-section" style={{ marginBottom: "20px" }}>
              <h4>🔍 Edge Cases</h4>
              <ul style={{ marginTop: "8px", color: "var(--text-secondary)", paddingLeft: "20px" }}>
                {reviewResult.edgeCases.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {reviewResult.optimizationSuggestions?.length > 0 && (
            <div className="ai-section" style={{ marginBottom: "20px" }}>
              <h4>💡 Optimization Suggestions</h4>
              <ul style={{ marginTop: "8px", color: "var(--text-secondary)", paddingLeft: "20px" }}>
                {reviewResult.optimizationSuggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIReviewModal;
