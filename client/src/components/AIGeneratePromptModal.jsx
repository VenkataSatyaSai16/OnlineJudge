import { useState } from "react";
import { X, Sparkles } from "lucide-react";

function AIGeneratePromptModal({ onClose, onGenerate, isGenerating }) {
  const [promptData, setPromptData] = useState({
    topic: "",
    difficulty: "",
    companyStyle: "",
    shortDescription: "",
    similarProblem: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPromptData({ ...promptData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!promptData.topic || !promptData.difficulty || !promptData.shortDescription) {
      setError("Topic, Difficulty, and Short Description are required.");
      return;
    }
    setError("");
    onGenerate(promptData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h2>✨ Generate Problem with AI</h2>
          <button className="btn-icon" onClick={onClose} disabled={isGenerating}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div className="state-box state-error" style={{ marginBottom: "16px", padding: "10px" }}>{error}</div>}
          
          <div className="stack" style={{ gap: "12px" }}>
            <label className="field-label">
              <span>Topic *</span>
              <input type="text" className="form-input" name="topic" value={promptData.topic} onChange={handleChange} placeholder="e.g. Sliding Window, Graph BFS" disabled={isGenerating} />
            </label>

            <label className="field-label">
              <span>Difficulty *</span>
              <select className="form-input" name="difficulty" value={promptData.difficulty} onChange={handleChange} disabled={isGenerating}>
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            <label className="field-label">
              <span>Short Description *</span>
              <textarea className="form-input" rows="3" name="shortDescription" value={promptData.shortDescription} onChange={handleChange} placeholder="Briefly describe the problem concept..." disabled={isGenerating} />
            </label>

            <label className="field-label">
              <span>Company Style (Optional)</span>
              <input type="text" className="form-input" name="companyStyle" value={promptData.companyStyle} onChange={handleChange} placeholder="e.g. FAANG, Quant" disabled={isGenerating} />
            </label>

            <label className="field-label">
              <span>Similar Problem (Optional)</span>
              <input type="text" className="form-input" name="similarProblem" value={promptData.similarProblem} onChange={handleChange} placeholder="e.g. Two Sum" disabled={isGenerating} />
            </label>
          </div>
        </div>
        
        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button className="btn btn-outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : <><Sparkles size={16} /> Generate</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIGeneratePromptModal;
