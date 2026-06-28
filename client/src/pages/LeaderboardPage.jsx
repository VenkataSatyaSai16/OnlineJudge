import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboardApi";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);

        const response = await getLeaderboard();

        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="page-container">
      <h1 className="page-title">Leaderboard</h1>

      <div className="table-container">
        <table className="oj-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Solved</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.solvedCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No Users Have Solved Any Problems Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Leaderboard;
