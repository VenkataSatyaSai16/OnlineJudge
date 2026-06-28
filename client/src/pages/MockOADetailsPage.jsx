import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMockOAById, startMockOA } from "../api/mockOAApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function MockOADetailsPage() {
  const { oaId } = useParams();
  const [oa, setOa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMockOAById(oaId)
      .then((response) => setOa(response.data.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load Mock OA"))
      .finally(() => setLoading(false));
  }, [oaId]);

  const begin = async () => {
    await startMockOA(oaId);
    window.location.href = `/mock-oa/${oaId}/attempt`;
  };

  if (loading) return <main className="page-container"><LoadingState /></main>;

  return (
    <main className="page-container">
      <ErrorState message={error} />
      <div className="list-card vertical">
        <h1>{oa?.company || "Generic"} Mock OA</h1>
        <p>{oa?.level} · {oa?.duration} minutes · {oa?.status}</p>
        <div className="stack">
          {oa?.questionIds?.map((question, index) => (
            <div className="mini-card" key={question._id}>
              <strong>Question {index + 1}: {question.title}</strong>
              <span className={`diff-badge diff-${question.difficulty?.toLowerCase()}`}>{question.difficulty}</span>
            </div>
          ))}
        </div>
        <div className="card-row">
          <button className="btn-primary" onClick={begin}>Start / Continue</button>
          {oa?.status === "submitted" && <Link className="edit-btn" to={`/mock-oa/${oaId}/result`}>View Result</Link>}
        </div>
      </div>
    </main>
  );
}

export default MockOADetailsPage;
