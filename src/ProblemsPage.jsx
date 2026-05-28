import "./App.css";
import { useCallback, useEffect, useState } from "react";

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

function ProblemsPage({ questionId, user, token, onNavigate }){
    const [problems, setProblems] = useState([]);
    const [problem, setProblem] = useState(null);
    const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const isAdmin = user?.role === "admin";

    const loadProblems = useCallback(async ({ showLoading = true } = {}) => {
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
    }, [questionId]);

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
            await loadProblems({ showLoading: false });
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="problems-page">
                <h1>Problems</h1>
                {isAdmin && !questionId && (
                    <AdminQuestionForm
                        form={questionForm}
                        saving={saving}
                        onChange={updateQuestionForm}
                        onSubmit={submitQuestion}
                    />
                )}
                {success && <p className="message success">{success}</p>}
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="problems-page">
                <h1>Problems</h1>
                {isAdmin && !questionId && (
                    <AdminQuestionForm
                        form={questionForm}
                        saving={saving}
                        onChange={updateQuestionForm}
                        onSubmit={submitQuestion}
                    />
                )}
                <p className="message error">{error}</p>
            </div>
        );
    }

    if (questionId && problem) {
        return (
            <div className="problems-page">
                <button type="button" onClick={() => onNavigate("/problems")}>
                    Back to problems
                </button>
                <h1>{problem.question}</h1>
                <p><strong>Difficulty:</strong> {problem.difficultyLevel}</p>
                <p>{problem.questionDesc}</p>
                <h2>Sample Input</h2>
                <pre>{problem.sampleInput}</pre>
                <h2>Sample Output</h2>
                <pre>{problem.sampleOutput}</pre>
                {problem.topics?.length > 0 && (
                    <p><strong>Topics:</strong> {problem.topics.join(", ")}</p>
                )}
            </div>
        );
    }

    return (
        <div className="problems-page">
            <h1>Problems</h1>
            {isAdmin && (
                <AdminQuestionForm
                    form={questionForm}
                    saving={saving}
                    onChange={updateQuestionForm}
                    onSubmit={submitQuestion}
                />
            )}
            {success && <p className="message success">{success}</p>}
            <table id="problems-table" className="problems-table">
                <thead>
                    <tr id="problems-table-header">
                        <th>ID</th> 
                        <th>Title</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem) => (
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
                        </tr>
                    ))}
                </tbody>
            </table>  
        </div>
    ); 
}

function AdminQuestionForm({ form, saving, onChange, onSubmit }) {
    return (
        <form className="admin-question-form" onSubmit={onSubmit}>
            <h2>Add Question</h2>
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
                {saving ? "Adding..." : "Add Question"}
            </button>
        </form>
    );
}

export default ProblemsPage;
