import { supabase } from "./lib/supabase.js";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function GoogleLoginPage({ onAuth, onDone }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/googleLogin`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const saveGoogleUser = async () => {
      setLoading(true);
      setError("");

      const { data, error: sessionError } = await supabase.auth.getSession();
      const supabaseUser = data.session?.user;

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      if (!supabaseUser) {
        setLoading(false);
        return;
      }

      try {
        const metadata = supabaseUser.user_metadata || {};
        const response = await fetch(`${API_URL}/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            googleId: supabaseUser.id,
            email: supabaseUser.email,
            firstName: metadata.given_name,
            lastName: metadata.family_name,
            fullName: metadata.full_name || metadata.name,
            profileImage: metadata.avatar_url || metadata.picture,
          }),
        });
        const authData = await response.json();

        if (!response.ok) {
          throw new Error(authData.message || "Unable to save Google login");
        }

        onAuth(authData.user, authData.token);
        onDone();
      } catch (saveError) {
        setError(saveError.message);
      } finally {
        setLoading(false);
      }
    };

    saveGoogleUser();
  }, [onAuth, onDone]);

  return (
    <main className="page auth-page">
      <section className="auth-box">
        <h1>Login with Google</h1>

        <button onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Please wait..." : "Continue with Google"}
        </button>
        {error && <p className="message error">{error}</p>}
      </section>
    </main>
  );
}

export default GoogleLoginPage;
