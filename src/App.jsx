import { useEffect, useState } from "react";
//import { supabase } from "../lib/supabase";
import HomePage from "./HomePage";
import Navbar from "./Navbar";
import ProblemsPage from "./ProblemsPage";
import AuthPage from "./AuthPage";
import ProfilePage from "./ProfilePage";
import "./App.css";
import GoogleLoginPage from "./GoogleLogin";
import Leaderboard from "./Leaderboard";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const renderPage = () => {
    if (path === "/problems") {
      return <ProblemsPage user={user} token={token} onNavigate={navigate} />;
    }

    if (path === "/problems/add") {
      return (
        <ProblemsPage
          isAddPage
          user={user}
          token={token}
          onNavigate={navigate}
        />
      );
    }

    if (path.startsWith("/problems/edit/")) {
      const questionId = decodeURIComponent(path.replace("/problems/edit/", ""));
      return (
        <ProblemsPage
          questionId={questionId}
          isEditPage
          user={user}
          token={token}
          onNavigate={navigate}
        />
      );
    }

    if (path.startsWith("/problems/")) {
      const questionId = decodeURIComponent(path.replace("/problems/", ""));
      return (
        <ProblemsPage
          questionId={questionId}
          user={user}
          token={token}
          onNavigate={navigate}
        />
      );
    }

    if (path === "/register") {
      return <AuthPage mode="register" onAuth={saveAuth} />;
    }

    if (path === "/login") {
      return <AuthPage mode="login" onAuth={saveAuth} />;
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

    if(path === "/googleLogin"){
      return (
        <GoogleLoginPage
          onAuth={saveAuth}
          onDone={() => navigate("/profile")}
        />
      );
    }

    if(path === "/leaderboard"){
      return (
        <Leaderboard />
      );
    }

    return <HomePage />;
  };

  return (
    <>
      <Navbar user={user} onNavigate={navigate} />
      {renderPage()}
    </>
  );
}

export default App;
