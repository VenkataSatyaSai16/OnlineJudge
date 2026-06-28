import { useEffect, useState } from "react";
import api from "../services/axiosInstance";
import useAuth from "../hooks/useAuth";

function SubmissionTable() {
  const [submissions, setSubmissions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/submission");
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubmissions();
  }, [user]);

  return (
    <div className="submission-table-container">
      <table className="submission-table">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Difficulty</th>
            <th>Verdict</th>
            <th>Language</th>
            <th>Submitted At</th>
          </tr>
        </thead>

        <tbody>
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.problemId?.title}</td>

                <td
                  className={
                    submission.problemId?.difficulty === "Easy"
                      ? "easy"
                      : submission.problemId?.difficulty === "Medium"
                        ? "medium"
                        : "hard"
                  }
                >
                  {submission.problemId?.difficulty}
                </td>

                <td
                  className={
                    submission.verdict === "Accepted" ? "accepted" : "rejected"
                  }
                >
                  {submission.verdict}
                </td>

                <td>{submission.language}</td>

                <td>{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-submissions">
                No Submissions Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SubmissionTable;
