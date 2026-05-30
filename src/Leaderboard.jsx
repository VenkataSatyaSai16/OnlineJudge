import React, { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/leaderboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        return response.json();
      })
      .then((data) => setLeaderboard(data))
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setError("Could not load leaderboard.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="leaderboard-page">
      <section className="leaderboard-panel">
        <div className="leaderboard-header">
          <div>
            <p className="eyebrow">Rankings</p>
            <h1>Leaderboard</h1>
          </div>
        </div>

        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="3" className="leaderboard-state">
                    Loading leaderboard...
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td colSpan="3" className="leaderboard-state leaderboard-error">
                    {error}
                  </td>
                </tr>
              )}

              {!isLoading && !error && leaderboard.length === 0 && (
                <tr>
                  <td colSpan="3" className="leaderboard-state">
                    No scores yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                leaderboard.map((user, index) => (
                  <tr key={user.username || index}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td className="leaderboard-user">{user.username}</td>
                    <td className="leaderboard-score">{user.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Leaderboard;
