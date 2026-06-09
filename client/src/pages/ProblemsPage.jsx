import { useEffect, useState } from "react";
import { getProblems } from "../api/problemApi.js";
import { Link } from "react-router-dom";
import { deleteProblem } from "../api/problemApi.js";
import useAuth from "../hooks/useAuth";

function ProblemPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteProblem(id);
      console.log(response);
    } finally {
      console.log("");
    }
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProblems();
        setProblems(response.data.Questions);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Problems</h1>
      {user?.role === "admin" && (
        <Link to="/problems/add" className="add-problem-btn">
          + Add Problem
        </Link>
      )}
      <div className="table-container">
        <table className="oj-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <td>{index + 1}</td>

                <td>{problem.title}</td>

                <td>
                  <span
                    className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>

                <td>
                  <Link to={`/problems/${problem._id}`}>Solve</Link>

                  {user?.role === "admin" && (
                    <div className="admin-actions">
                      <Link
                        className="edit-btn"
                        to={`/problems/${problem._id}/edit`}
                      >
                        Edit
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(problem._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemPage;
