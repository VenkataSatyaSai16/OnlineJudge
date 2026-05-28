import {useState} from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


function AuthPage({ mode, onAuth }) {
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

        {error && <p className="message error">{error}</p>}
      </section>
    </main>
  );
}

export default AuthPage;
