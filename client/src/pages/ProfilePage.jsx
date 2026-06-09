import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="page-container">
        <div className="form-container" style={{textAlign: "center"}}>
          <h2>Login or Register to view your profile</h2>
          <Link className="btn-primary" to="/login" style={{textDecoration: "none"}}>Login</Link>
          <Link className="btn-primary" to="/register" style={{textDecoration: "none", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-color)"}}>Register</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 className="page-title">Profile</h1>

      <div className="profile-card">
        <h2>Your Information</h2>
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
