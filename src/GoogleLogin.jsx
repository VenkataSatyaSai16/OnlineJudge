import { supabase } from "./lib/supabase.js";
import "./App.css";

function GoogleLoginPage() {

    console.log(import.meta.env.VITE_SUPABASE_URL);
    console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const handleGoogleLogin = async () => {

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/",
      },
    });

    if (error) {
      console.log(error.message);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-box">
        <h1>Login with Google</h1>

        <button onClick={handleGoogleLogin}>Continue with Google</button>
      </section>
    </main>
  );
}

export default GoogleLoginPage;
