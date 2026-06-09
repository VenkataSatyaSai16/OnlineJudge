import { useEffect , useRef } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase";
import { googleAuth } from "../api/authApi";
import useAuth from "../hooks/useAuth";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    async function completeGoogleLogin() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error(error);
          navigate("/login");
          return;
        }
        const username =
          user.user_metadata.full_name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_") +
          "_" +
          Math.floor(Math.random() * 10000);

        const response = await googleAuth({
          email: user.email,
          username: username,
        });

        login(response.data.user);

        navigate("/");
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    }

    if (hasRun.current) return;

    hasRun.current = true;
    completeGoogleLogin();
  }, [login, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        fontSize: "18px",
      }}
    >
      Signing you in with Google...
    </div>
  );
}

export default AuthCallbackPage;
