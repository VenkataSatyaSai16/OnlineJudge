import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import { supabase } from "../supabase";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await loginUser(formData);
      login(response.data.user);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };

  return (
    <main className="page-container">
      <div className="form-container">
        <h1>Login</h1>

        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <button className="btn-primary" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>
    </main>
  );
}

export default LoginPage;
