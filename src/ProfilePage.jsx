import "./App.css";

function ProfilePage({ user, token, onLogout, onLogin }) {
  if (!user || !token) {
    return (
      <main className="page auth-page">
        <section className="auth-box">
          <h1>Profile</h1>
          <p>Please login to view your profile.</p>
          <button type="button" onClick={onLogin}>
            Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page auth-page">
      <section className="auth-box profile">
        <h1>Profile</h1>
        <p>
          Name: <strong>{user.firstName} {user.lastName}</strong>
        </p>
        <p>Email: {user.email}</p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default ProfilePage;