import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkUsername } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import { supabase } from "../supabase";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUsernameChange = async (e) => {
    const username = e.target.value;
    setFormData({
      ...formData,
      username,
    });

    if (username.trim().length < 3) {
      setUsernameStatus(null);
      return;
    }

    try {
      setCheckingUsername(true);
      const response = await checkUsername(username);
      if (response.data.available) {
        setUsernameStatus("available");
      } else {
        setUsernameStatus("taken");
      }
    } catch (error) {
      console.error(error);
      setUsernameStatus(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      const response = await registerUser(formData);
      console.log(response.data);
      login(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {

  await supabase.auth.signInWithOAuth({
    provider: "google",

    options: {
      redirectTo:
        window.location.origin +
        "/auth/callback",
    },
  });
};

  return (
    <main className="page-container">
      <div className="form-container">
        <h2>Register</h2>
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleUsernameChange}
        />
        {checkingUsername && (
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
          >
            Checking username...
          </p>
        )}
        {usernameStatus === "" && <p style={{ margin: 0 }}></p>}
        {usernameStatus === "available" && (
          <p style={{ margin: 0, fontSize: "14px", color: "var(--diff-easy)" }}>
            ✅ Username Available
          </p>
        )}
        {usernameStatus === "taken" && (
          <p style={{ margin: 0, fontSize: "14px", color: "var(--diff-hard)" }}>
            ❌ Username Already Taken
          </p>
        )}

        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          className="btn-primary"
          onClick={register}
          disabled={loading || usernameStatus !== "available"}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <hr></hr>
        <button className="btn-primary" onClick={handleGoogleLogin}>
          Sign Up with Google
        </button>
      </div>
    </main>
  );
}

export default RegisterPage;
