import { useEffect, useState } from "react";
import { addDiscussion, deleteDiscussion, getDiscussions } from "../api/discussionApi";
import { invalidateFrontendCache } from "../services/axiosInstance";
import useAuth from "../hooks/useAuth";
import DiscussionCard from "../components/DiscussionCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

function DiscussionsPage() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [discussion, setDiscussion] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDiscussions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getDiscussions(page, 10);
      setDiscussions(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load discussions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussions();
  }, []);

  const createDiscussion = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await addDiscussion({ discussion });
      setDiscussion("");
      invalidateFrontendCache("/discussions");
      loadDiscussions(1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create discussion");
    }
  };

  const removeDiscussion = async (id) => {
    await deleteDiscussion(id);
    invalidateFrontendCache("/discussions");
    loadDiscussions(pagination.page);
  };

  return (
    <main className="page-container">
      <h1 className="page-title">Discussions</h1>
      <ErrorState message={error} />
      {user && (
        <form className="inline-form" onSubmit={createDiscussion}>
          <textarea
            className="form-input"
            value={discussion}
            onChange={(event) => setDiscussion(event.target.value)}
            placeholder="Start a discussion"
            rows="3"
          />
          <button className="btn-primary" disabled={!discussion.trim()}>
            Post Discussion
          </button>
        </form>
      )}
      {loading ? <LoadingState /> : discussions.length === 0 ? (
        <EmptyState message="No discussions yet." />
      ) : (
        <div className="stack">
          {discussions.map((item) => (
            <DiscussionCard key={item._id} discussion={item} onDelete={removeDiscussion} />
          ))}
        </div>
      )}
      <div className="pagination">
        <button disabled={!pagination.hasPrevPage} onClick={() => loadDiscussions(pagination.page - 1)}>Prev</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button disabled={!pagination.hasNextPage} onClick={() => loadDiscussions(pagination.page + 1)}>Next</button>
      </div>
    </main>
  );
}

export default DiscussionsPage;
