import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { deleteProblem, getProblems } from "../api/problemApi.js";
import useAuth from "../hooks/useAuth";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

function ProblemPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await deleteProblem(id);
      setProblems((prev) => prev.filter((problem) => problem._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete problem");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getProblems();
        setProblems(response.data.Questions);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load problems");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="page-container">
      <div className="page-heading-row">
        <div>
          <p className="page-kicker">Problemset</p>
          <h1 className="page-title">Problems</h1>
          <p className="page-subtitle">Filter, solve, and manage public coding problems.</p>
        </div>
        {user?.role === "admin" && (
          <Link to="/problems/add" className="add-problem-btn icon-link">
            <Plus size={16} /> Add Problem
          </Link>
        )}
      </div>

      <ErrorState message={error} />

      <section className="filter-bar">
        <label className="search-input">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or tag"
          />
        </label>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </section>

      {loading ? (
        <LoadingState message="Loading problems..." />
      ) : filteredProblems.length === 0 ? (
        <EmptyState message="No problems match your filters." />
      ) : (
        <div className="table-container">
          <table className="oj-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem._id}>
                  <td>
                    <span className="status-dot"><ShieldCheck size={16} /></span>
                  </td>
                  <td>
                    <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
                  </td>
                  <td>
                    <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <div className="tag-list">
                      {problem.tags?.slice(0, 3).map((tag) => (
                        <span className="tag-pill" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link className="edit-btn icon-link" to={`/problems/${problem._id}`}>
                        Solve
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <Link className="edit-btn icon-link" to={`/problems/${problem._id}/edit`}>
                            <Edit3 size={14} /> Edit
                          </Link>
                          <button className="delete-btn icon-link" onClick={() => handleDelete(problem._id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default ProblemPage;
