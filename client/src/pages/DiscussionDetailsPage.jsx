import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  deleteComment,
  editDiscussion,
  getComments,
  getDiscussionById,
} from "../api/discussionApi";
import useAuth from "../hooks/useAuth";
import CommentCard from "../components/CommentCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function DiscussionDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editText, setEditText] = useState("");
  const [editing, setEditing] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canEdit = user?.role === "admin" || discussion?.userId?._id === user?._id;

  const loadData = async (page = 1) => {
    try {
      setLoading(true);
      const [discussionResponse, commentsResponse] = await Promise.all([
        getDiscussionById(id),
        getComments(id, page, 10),
      ]);
      setDiscussion(discussionResponse.data.data);
      setEditText(discussionResponse.data.data.discussion);
      setComments(commentsResponse.data.data);
      setPagination(commentsResponse.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load discussion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const saveDiscussion = async () => {
    await editDiscussion(id, { discussion: editText });
    setEditing(false);
    loadData(pagination.page);
  };

  const createComment = async (event) => {
    event.preventDefault();
    try {
      await addComment(id, { comment });
      setComment("");
      loadData(1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add comment");
    }
  };

  const removeComment = async (commentId) => {
    await deleteComment(commentId);
    loadData(pagination.page);
  };

  if (loading) return <main className="page-container"><LoadingState /></main>;

  return (
    <main className="page-container">
      <ErrorState message={error} />
      <div className="list-card vertical">
        {editing ? (
          <>
            <textarea className="form-input" value={editText} onChange={(event) => setEditText(event.target.value)} />
            <button className="btn-primary" onClick={saveDiscussion}>Save</button>
          </>
        ) : (
          <>
            <h1>{discussion?.discussion}</h1>
            <p className="muted">By {discussion?.userId?.username || "User"}</p>
            {canEdit && <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>}
          </>
        )}
      </div>
      {user && (
        <form className="inline-form" onSubmit={createComment}>
          <textarea className="form-input" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment" />
          <button className="btn-primary" disabled={!comment.trim()}>Add Comment</button>
        </form>
      )}
      <div className="stack">
        {comments.map((item) => (
          <CommentCard key={item._id} comment={item} onDelete={removeComment} />
        ))}
      </div>
      <div className="pagination">
        <button disabled={!pagination.hasPrevPage} onClick={() => loadData(pagination.page - 1)}>Prev</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button disabled={!pagination.hasNextPage} onClick={() => loadData(pagination.page + 1)}>Next</button>
      </div>
    </main>
  );
}

export default DiscussionDetailsPage;
