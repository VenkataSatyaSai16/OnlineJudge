import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import useAuth from "../hooks/useAuth";

function DiscussionCard({ discussion, onDelete }) {
  const { user } = useAuth();
  const canModify =
    user?.role === "admin" || discussion.userId?._id === user?._id || discussion.userId === user?._id;

  return (
    <div className="list-card">
      <div>
        <Link to={`/discussions/${discussion._id}`} className="card-title">
          {discussion.discussion}
        </Link>
        <p className="muted">
          By {discussion.userId?.username || "User"} · {discussion.commentsCount || 0} comments
        </p>
      </div>
      {canModify && (
        <button className="delete-btn" onClick={() => onDelete(discussion._id)} title="Delete Discussion">
          <Trash size={16} />
        </button>
      )}
    </div>
  );
}

export default DiscussionCard;
