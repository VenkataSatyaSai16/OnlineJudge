import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, checkUsername, checkEmail } from "../api/authApi";
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
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available', 'taken', null
  
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'available', 'taken', 'invalid', null

  const navigate = useNavigate();
  const { login } = useAuth();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const verifyUsername = async (username) => {
    if (username.trim().length < 3) {
      setUsernameStatus(null);
      setCheckingUsername(false);
      return;
    }
    try {
      setCheckingUsername(true);
      const response = await checkUsername(username);
      setUsernameStatus(response.data.available ? "available" : "taken");
    } catch (error) {
      console.error(error);
      setUsernameStatus(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedVerifyUsername = useCallback(debounce(verifyUsername, 500), []);

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setFormData((prev) => ({ ...prev, username }));
    setUsernameStatus(null);
    setCheckingUsername(true);
    debouncedVerifyUsername(username);
  };

  const verifyEmail = async (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus("invalid");
      setCheckingEmail(false);
      return;
    }
    try {
      setCheckingEmail(true);
      const response = await checkEmail(email);
      setEmailStatus(response.data.available ? "available" : "taken");
    } catch (error) {
      console.error(error);
      setEmailStatus(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedVerifyEmail = useCallback(debounce(verifyEmail, 500), []);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));
    setEmailStatus(null);
    if(email.length > 0) {
       setCheckingEmail(true);
       debouncedVerifyEmail(email);
    } else {
       setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    try {
      setLoading(true);
      const response = await registerUser(formData);
      login(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed");
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

  const isFormValid = formData.username && formData.email && formData.password && 
                      usernameStatus === "available" && emailStatus === "available";

  return (
    <main className="page-container">
      <div className="form-container">
        <h2>Register</h2>
        
        {/* Username Field */}
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleUsernameChange}
        />
        {checkingUsername && <p className="status-text muted">Checking username...</p>}
        {usernameStatus === "available" && <p className="status-text success">✅ Username Available</p>}
        {usernameStatus === "taken" && <p className="status-text error">❌ Username Already Taken</p>}

        {/* Email Field */}
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleEmailChange}
        />
        {checkingEmail && <p className="status-text muted">Checking email...</p>}
        {emailStatus === "available" && <p className="status-text success">✅ Email Available</p>}
        {emailStatus === "taken" && (
          <p className="status-text error">
            ❌ Email already registered, please <Link to="/login" style={{ color: "var(--primary-color)", fontWeight: "bold" }}>Login here</Link>.
          </p>
        )}
        {emailStatus === "invalid" && <p className="status-text error">❌ Invalid Email Format</p>}

        {/* Password Field */}
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
          disabled={loading || !isFormValid}
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
