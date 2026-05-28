import "./App.css";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyQuestionForm = {
  questionId: "",
  question: "",
  difficultyLevel: "Easy",
  questionDesc: "",
  sampleInput: "",
  sampleOutput: "",
  topics: "",
};

const languageTemplates = {
  javascript: "function main() {\n  \n}\n",
  python: "def main():\n    pass\n",
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  \n  return 0;\n}\n",
  java: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    \n  }\n}\n",
};

function ProblemsPage({ questionId, isAddPage = false, isEditPage = false, user, token, onNavigate }) {
  const [problems, setProblems] = useState([]);
  const [problem, setProblem] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [problemSearch, setProblemSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isAdmin = user?.role === "admin";

  const filteredProblems = useMemo(() => {
    const normalizedSearch = problemSearch.trim().toLowerCase();

    return problems.filter((problemItem) => {
      const matchesDifficulty =
        difficultyFilter === "All" || problemItem.difficultyLevel === difficultyFilter;
      const matchesSearch =
        !normalizedSearch ||
        problemItem.questionId.toLowerCase().includes(normalizedSearch) ||
        problemItem.question.toLowerCase().includes(normalizedSearch);

      return matchesDifficulty && matchesSearch;
    });
  }, [difficultyFilter, problemSearch, problems]);

  const loadProblems = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      try {
        const endpoint = questionId ? `/problems/${questionId}` : "/problems";
        const response = await fetch(`${API_URL}${endpoint}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load problems");
        }

        if (questionId) {
          setProblem(data.data);

          if (isEditPage) {
            setQuestionForm({
              questionId: data.data.questionId || "",
              question: data.data.question || "",
              difficultyLevel: data.data.difficultyLevel || "Easy",
              questionDesc: data.data.questionDesc || "",
              sampleInput: data.data.sampleInput || "",
              sampleOutput: data.data.sampleOutput || "",
              topics: Array.isArray(data.data.topics) ? data.data.topics.join(", ") : "",
            });
          }
        } else {
          setProblems(data.data);
        }
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [isEditPage, questionId],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProblems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProblems]);

  const updateQuestionForm = (event) => {
    setQuestionForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitQuestion = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(questionForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add question");
      }

      setQuestionForm(emptyQuestionForm);
      setSuccess("Question added successfully");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const submitQuestionEdit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/problems/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(questionForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update question");
      }

      setProblem(data.data);
      setSuccess("Question updated successfully");
      window.history.replaceState({}, "", `/problems/edit/${data.data.questionId}`);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (isAddPage) {
    if (!isAdmin) {
      return (
        <div className="problems-page">
          <h1>Add Question</h1>
          <p className="message error">Admin access required</p>
        </div>
      );
    }

    return (
      <div className="problems-page">
        <button className="btn-problems" type="button" onClick={() => onNavigate("/problems")}>
          Back to problems
        </button>
        <AdminQuestionForm
          form={questionForm}
          saving={saving}
          onChange={updateQuestionForm}
          onSubmit={submitQuestion}
        />
        {success && <p className="message success">{success}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    );
  }

  if (isEditPage) {
    if (!isAdmin) {
      return (
        <div className="problems-page">
          <h1>Edit Question</h1>
          <p className="message error">Admin access required</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="problems-page">
          <h1>Edit Question</h1>
          <p>Loading...</p>
        </div>
      );
    }

    if (error && !problem) {
      return (
        <div className="problems-page">
          <h1>Edit Question</h1>
          <p className="message error">{error}</p>
        </div>
      );
    }

    const activeQuestionId = problem?.questionId || questionForm.questionId || questionId;

    return (
      <div className="problems-page">
        <div className="problem-page-actions">
          <button className="btn-problems" type="button" onClick={() => onNavigate("/problems")}>
            Back to problems
          </button>
          <button className="btn-problems" type="button" onClick={() => onNavigate(`/problems/${activeQuestionId}`)}>
            View question
          </button>
        </div>
        <AdminQuestionForm
          form={questionForm}
          saving={saving}
          mode="edit"
          onChange={updateQuestionForm}
          onSubmit={submitQuestionEdit}
        />
        {success && <p className="message success">{success}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="problems-page">
        <h1>Problems</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problems-page">
        <h1>Problems</h1>
        <p className="message error">{error}</p>
      </div>
    );
  }

  if (questionId && problem) {
    return (
      <div className="problems-page problem-workspace">
        <button className="btn-problems" type="button" onClick={() => onNavigate("/problems")}>
          Back to problems
        </button>
        {isAdmin && (
          <button className="btn-problems" type="button" onClick={() => onNavigate(`/problems/edit/${problem.questionId}`)}>
            Edit question
          </button>
        )}
        <div className="problem-split">
          <section className="problem-description">
            <h1>{problem.question}</h1>
            <p>
              <strong>Difficulty:</strong> {problem.difficultyLevel}
            </p>
            <p>{problem.questionDesc}</p>
            <h2 className="ip-op-head">Sample Input</h2>
            <pre className="ip-op-data">{problem.sampleInput}</pre>
            <h2 className="ip-op-head">Sample Output</h2>
            <pre className="ip-op-data">{problem.sampleOutput}</pre>
            {problem.topics?.length > 0 && (
              <p>
                <strong>Topics:</strong> {problem.topics.join(", ")}
              </p>
            )}
          </section>
          <section className="code-panel">
            <EditorWindow previewCode={languageTemplates} />
            <div className="code-actions">
              <button type="button">Run</button>
              <button type="button">Submit</button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <h1>Problems</h1>
      {isAdmin && (
        <button className="add-question-button" type="button" onClick={() => onNavigate("/problems/add")}>
          +ADD
        </button>
      )}
      <div className="problems-controls">
        <label>
          Search problems
          <input
            type="search"
            value={problemSearch}
            onChange={(event) => setProblemSearch(event.target.value)}
            placeholder="Question no. or name"
          />
        </label>
        <label>
          Difficulty
          <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      </div>
      <table id="problems-table" className="problems-table">
        <thead>
          <tr id="problems-table-header">
            <th>ID</th>
            <th>Title</th>
            <th>Difficulty</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem) => (
            <tr key={problem.questionId}>
              <td>{problem.questionId}</td>
              <td>
                <button
                  type="button"
                  className="problem-link"
                  onClick={() => onNavigate(`/problems/${problem.questionId}`)}
                >
                  {problem.question}
                </button>
              </td>
              <td>{problem.difficultyLevel}</td>
              {isAdmin && (
                <td>
                  <button
                    type="button"
                    className="btn-problems"
                    onClick={() => onNavigate(`/problems/edit/${problem.questionId}`)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
          {filteredProblems.length === 0 && (
            <tr>
              <td className="empty-problems" colSpan={isAdmin ? 4 : 3}>
                No problems match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EditorWindow({ previewCode }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(previewCode.javascript);

  const updateLanguage = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(previewCode[nextLanguage]);
  };

  return (
    <>
      <div className="code-toolbar">
        <label>
          Language
          <select value={language} onChange={updateLanguage}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </label>
      </div>
      <div className="editor-window">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </>
  );
}

function AdminQuestionForm({ form, saving, mode = "add", onChange, onSubmit }) {
  const isEditMode = mode === "edit";

  return (
    <form className="admin-question-form" onSubmit={onSubmit}>
      <h2>{isEditMode ? "Edit Question" : "Add Question"}</h2>
      <div className="name-row">
        <label>
          Question ID
          <input
            name="questionId"
            value={form.questionId}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Difficulty
          <select
            name="difficultyLevel"
            value={form.difficultyLevel}
            onChange={onChange}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      </div>
      <label>
        Question title
        <input
          name="question"
          value={form.question}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="questionDesc"
          value={form.questionDesc}
          onChange={onChange}
          rows="5"
          required
        />
      </label>
      <div className="name-row">
        <label>
          Sample input
          <textarea
            name="sampleInput"
            value={form.sampleInput}
            onChange={onChange}
            rows="4"
            required
          />
        </label>
        <label>
          Sample output
          <textarea
            name="sampleOutput"
            value={form.sampleOutput}
            onChange={onChange}
            rows="4"
            required
          />
        </label>
      </div>
      <label>
        Topics
        <input
          name="topics"
          value={form.topics}
          onChange={onChange}
          placeholder="arrays, strings, dp"
          required
        />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Question")}
      </button>
    </form>
  );
}

export default ProblemsPage;
