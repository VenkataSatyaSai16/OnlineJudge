import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMockOAResult } from "../api/mockOAApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function MockOAResultPage() {
  const { oaId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMockOAResult(oaId)
      .then((response) => setResult(response.data.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load result"))
      .finally(() => setLoading(false));
  }, [oaId]);

  if (loading) return <main className="page-container"><LoadingState /></main>;

  return (
    <main className="page-container">
      <h1 className="page-title">Mock OA Result</h1>
      <ErrorState message={error} />
      {result && (
        <>
          <div className="ai-stat-grid">
            <div className="ai-stat-card"><div className="ai-stat-label">Score</div><div className="ai-stat-value">{result.score}%</div></div>
            <div className="ai-stat-card"><div className="ai-stat-label">Solved</div><div className="ai-stat-value">{result.questionsSolved}/{result.results.length}</div></div>
            <div className="ai-stat-card"><div className="ai-stat-label">Attempted</div><div className="ai-stat-value">{result.questionsAttempted}</div></div>
          </div>
          <div className="stack">
            {result.results.map((item) => (
              <div className="list-card" key={item.problemId?._id || item.problemId}>
                <div>
                  <strong>{item.problemId?.title || "Problem"}</strong>
                  <p className="muted">{item.passedTestCases}/{item.totalTestCases} test cases passed</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="verdict-badge badge-pending">{item.verdict}</span>
                  <Link 
                    to={`/problems/${item.problemId?._id || item.problemId}`}
                    className="btn-primary"
                    style={{ textDecoration: "none", fontSize: "14px", padding: "6px 12px" }}
                  >
                    Practice Again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default MockOAResultPage;
