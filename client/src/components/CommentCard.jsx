import useAuth from "../hooks/useAuth";

function CommentCard({ comment, onDelete }) {
  const { user } = useAuth();
  const canDelete =
    user?.role === "admin" || comment.userId?._id === user?._id || comment.userId === user?._id;

  return (
    <div className="comment-card">
      <p>{comment.comment}</p>
      <div className="card-row">
        <span className="muted">By {comment.userId?.username || "User"}</span>
        {canDelete && (
          <button className="delete-btn" onClick={() => onDelete(comment._id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
