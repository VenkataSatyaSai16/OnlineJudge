import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getSavedAuth = () => {
  const savedUser = localStorage.getItem("authUser");
  const savedToken = localStorage.getItem("authToken");

  if (!savedUser || !savedToken) {
    return { user: null, token: "" };
  }

  try {
    return { user: JSON.parse(savedUser), token: savedToken };
  } catch {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    return { user: null, token: "" };
  }
};

function App() {
  const [savedAuth] = useState(getSavedAuth);
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(savedAuth.user);
  const [token, setToken] = useState(savedAuth.token);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  const saveAuth = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("authUser", JSON.stringify(nextUser));
    localStorage.setItem("authToken", nextToken);
    setMessage("Success");
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    setMessage("Logged out");
    navigate("/");
  };

  const renderPage = () => {
    if (path === "/problems") {
      return <ProblemsPage />;
    }

    if (path === "/register") {
      return <AuthPage mode="register" onAuth={saveAuth} message={message} />;
    }

    if (path === "/login") {
      return <AuthPage mode="login" onAuth={saveAuth} message={message} />;
    }

    if (path === "/profile") {
      return (
        <ProfilePage
          token={token}
          user={user}
          onLogout={logout}
          onLogin={() => navigate("/login")}
        />
      );
    }

    return <HomePage />;
  };

  return (
    <>
      <Navbar user={user} onNavigate={navigate} />
      {message && <p className="top-message">{message}</p>}
      {renderPage()}
    </>
  );
}

function Navbar({ user, onNavigate }) {
  return (
    <header className="navbar">
      <button className="logo" type="button" onClick={() => onNavigate("/")}>
        <span className="logo-mark">S</span>
        <span>Skillter</span>
      </button>

      <nav>
        <button type="button" onClick={() => onNavigate("/problems")}>
          Problems
        </button>

        {user ? (
          <button
            className="profile-icon"
            type="button"
            onClick={() => onNavigate("/profile")}
            title="Profile"
          >
            {user.firstName?.charAt(0) || "P"}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => onNavigate("/login")}>
              Login
            </button>
            <button type="button" onClick={() => onNavigate("/register")}>
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <main className="page home-page">
      <section className="hero">
        <p className="eyebrow">Online Judge</p>
        <h1>Skillter</h1>
        <p>Practice problems, improve skills, and track your coding journey.</p>
      </section>
    </main>
  );
}

function ProblemsPage() {
  return (
    <main className="page">
      <section className="panel">
        <h1>Problems</h1>
      </section>
    </main>
  );
}

function AuthPage({ mode, onAuth, message }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/login" : "/register";
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      onAuth(data.user, data.token);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-box">
        <div className="auth-header">
          <p className="brand">Skillter</p>
          <h1>{isLogin ? "Login" : "Register"}</h1>
        </div>

        <form onSubmit={submitAuth}>
          {!isLogin && (
            <div className="name-row">
              <label>
                First name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={updateField}
                  required
                />
              </label>
              <label>
                Last name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={updateField}
                  required
                />
              </label>
            </div>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              minLength="6"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {message === "Success" && <p className="message success">Success</p>}
        {error && <p className="message error">{error}</p>}
      </section>
    </main>
  );
}

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

export default App;
