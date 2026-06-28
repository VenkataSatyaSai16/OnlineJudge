import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { editProblem, getProblemById } from "../api/problemApi";
import { FileCode2, ListPlus, Plus, Save, Trash2, Sparkles, BrainCircuit } from "lucide-react";
import { analyzeProblemComplexity, generateProblemFromPrompt, getAiUsage } from "../api/aiApi";
import AIAnalysisModal from "../components/AIAnalysisModal";
import AIGenerateModal from "../components/AIGenerateModal";
import AIGeneratePromptModal from "../components/AIGeneratePromptModal";

function EditProblemPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [aiUsage, setAiUsage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratePrompt, setShowGeneratePrompt] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedProblem, setGeneratedProblem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    timeLimit: "",
    memoryLimit: "",
    tags: [],
    examples: [
      {
        input: "",
        output: "",
      },
    ],
    testCases: [
      {
        input: "",
        output: "",
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProblemById(id);

        const question = response.data.Question;

        setFormData({
          title: question.title || "",
          description: question.description || "",
          difficulty: question.difficulty || "",
          inputFormat: question.inputFormat || "",
          outputFormat: question.outputFormat || "",
          constraints: question.constraints || "",
          timeLimit: question.timeLimit || "",
          memoryLimit: question.memoryLimit || "",

          tags: question.tags || [],

          examples: question.examples?.length
            ? question.examples
            : [{ input: "", output: "" }],

          testCases: question.testCases?.length
            ? question.testCases
            : [{ input: "", output: "" }],
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
    if (user && user.role === "admin") {
      getAiUsage().then(res => setAiUsage(res.data.data)).catch(console.error);
    }
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index][field] = value;
    setFormData({
      ...formData,
      examples: updatedExamples,
    });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        {
          input: "",
          output: "",
        },
      ],
    });
  };

  const removeExample = (index) => {
    if (formData.examples.length === 1) return;
    const updatedExamples = formData.examples.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      examples: updatedExamples,
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData({
      ...formData,
      testCases: updatedTestCases,
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        {
          input: "",
          output: "",
        },
      ],
    });
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length === 1) return;
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testCases: updatedTestCases,
    });
  };
  const editQuestion = async () => {
    try {
      const response = await editProblem(id, formData);
      alert(response.data.message);
      navigate("/problems");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Update Failed");
    }
  };

  const handleAnalyze = async () => {
    if (!formData.title || !formData.description || !formData.constraints) {
      alert("Validation Error: Title, Description, and Constraints are required.");
      return;
    }
    if (!formData.examples || formData.examples.length === 0 || !formData.examples[0].input) {
      alert("Validation Error: At least one example is required.");
      return;
    }
    if (!formData.testCases || formData.testCases.length === 0 || !formData.testCases[0].input) {
      alert("Validation Error: At least one test case is required.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await analyzeProblemComplexity(formData);
      setAnalysisResult(res.data.data);
      getAiUsage().then(r => setAiUsage(r.data.data)).catch(console.error);
    } catch (err) {
      alert(err.response?.data?.message || "AI Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSubmit = async (promptData) => {
    try {
      setIsGenerating(true);
      const res = await generateProblemFromPrompt(promptData);
      setGeneratedProblem(res.data.data);
      setShowGeneratePrompt(false);
      getAiUsage().then(r => setAiUsage(r.data.data)).catch(console.error);
    } catch (err) {
      alert(err.response?.data?.message || "AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyAnalysis = (analysis) => {
    setFormData({
      ...formData,
      difficulty: analysis.difficulty,
      tags: analysis.topics,
      timeLimit: analysis.recommendedTimeLimit,
      memoryLimit: analysis.recommendedMemoryLimit,
    });
    setAnalysisResult(null);
  };

  const applyGenerated = (problem) => {
    setFormData({
      ...formData,
      title: problem.title || "",
      description: problem.description || "",
      difficulty: problem.difficulty || "",
      inputFormat: problem.inputFormat || "",
      outputFormat: problem.outputFormat || "",
      constraints: problem.constraints || "",
      timeLimit: problem.recommendedTimeLimit || "",
      memoryLimit: problem.recommendedMemoryLimit || "",
      tags: problem.topics || [],
      examples: problem.examples && problem.examples.length > 0 ? problem.examples : formData.examples,
      testCases: problem.testCases && problem.testCases.length > 0 ? problem.testCases : formData.testCases,
    });
    setGeneratedProblem(null);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <main className="page-container">
        <div className="state-box state-error">Access denied. Admin privileges are required.</div>
      </main>
    );
  }

  return (
    <div className="add-problem-container">
      {showGeneratePrompt && (
        <AIGeneratePromptModal 
          onClose={() => setShowGeneratePrompt(false)} 
          onGenerate={handleGenerateSubmit} 
          isGenerating={isGenerating} 
        />
      )}
      
      {analysisResult && (
        <AIAnalysisModal 
          analysis={analysisResult} 
          onClose={() => setAnalysisResult(null)} 
          onApply={applyAnalysis} 
        />
      )}

      {generatedProblem && (
        <AIGenerateModal 
          problem={generatedProblem} 
          onClose={() => setGeneratedProblem(null)} 
          onApply={applyGenerated} 
        />
      )}
      <div className="form-header">
        <div>
          <p className="page-kicker">Admin</p>
          <h1>Edit Problem</h1>
          <p className="page-subtitle">Update statement, examples, and judge test cases.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <button 
              type="button"
              className="btn btn-outline icon-link" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || isGenerating}
            >
              <BrainCircuit size={16} /> {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
            {aiUsage && (
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Complexity: {aiUsage.aiComplexity.limit - aiUsage.aiComplexity.used} / {aiUsage.aiComplexity.limit} Today
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <button 
              type="button"
              className="btn btn-outline icon-link" 
              onClick={() => setShowGeneratePrompt(true)}
              disabled={isAnalyzing || isGenerating}
            >
              <Sparkles size={16} /> Generate with AI
            </button>
            {aiUsage && (
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Generate: {aiUsage.aiGenerate.limit - aiUsage.aiGenerate.used} / {aiUsage.aiGenerate.limit} Today
              </span>
            )}
          </div>

          <button type="button" className="submit-btn icon-link" onClick={editQuestion} disabled={isAnalyzing || isGenerating}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="problem-form-grid">
        <div className="left-panel">
          {/* Basic Details */}

          <div className="form-card">
            <h2><FileCode2 size={18} /> Basic Details</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Problem Title</label>
              <input
                type="text"
                name="title"
                placeholder="Problem Title"
                value={formData.title}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Problem Description</label>
              <textarea
                rows="10"
                name="description"
                placeholder="Problem Description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Time Limit (ms)</label>
                <input
                  type="number"
                  name="timeLimit"
                  placeholder="e.g. 2000"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>Memory Limit (MB)</label>
                <input
                  type="number"
                  name="memoryLimit"
                  placeholder="e.g. 256"
                  value={formData.memoryLimit}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h2><ListPlus size={18} /> Formats</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Input Format</label>
              <textarea
                rows="4"
                name="inputFormat"
                placeholder="Input Format"
                value={formData.inputFormat}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Output Format</label>
              <textarea
                rows="4"
                name="outputFormat"
                placeholder="Output Format"
                value={formData.outputFormat}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Constraints</label>
              <textarea
                rows="4"
                name="constraints"
                placeholder="Constraints"
                value={formData.constraints}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block", fontWeight: 500 }}>Tags</label>
              <input
                type="text"
                placeholder="Tags"
                value={formData.tags?.join(", ")}
                onChange={handleTagsChange}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="right-panel">
          {/* Examples */}

          <div className="form-card">
            <div className="section-header">
              <h2>Examples</h2>

              <button type="button" className="add-btn icon-link" onClick={addExample}>
                <Plus size={15} /> Add Example
              </button>
            </div>

            {formData.examples.map((example, index) => (
              <div className="example-card" key={index}>
                <h4>Example {index + 1}</h4>

                <textarea
                  rows="3"
                  placeholder="Input"
                  value={example.input}
                  onChange={(e) =>
                    handleExampleChange(index, "input", e.target.value)
                  }
                />

                <textarea
                  rows="3"
                  placeholder="Output"
                  value={example.output}
                  onChange={(e) =>
                    handleExampleChange(index, "output", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeExample(index)}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Test Cases */}

          <div className="form-card">
            <div className="section-header">
              <h2>Test Cases</h2>

              <button type="button" className="add-btn icon-link" onClick={addTestCase}>
                <Plus size={15} /> Add Test Case
              </button>
            </div>

            {formData.testCases.map((testCase, index) => (
              <div className="testcase-card" key={index}>
                <h4>Test Case {index + 1}</h4>

                <textarea
                  rows="3"
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                />

                <textarea
                  rows="3"
                  placeholder="Expected Output"
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeTestCase(index)}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProblemPage;
