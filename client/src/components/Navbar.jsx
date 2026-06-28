import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  Brain,
  Code2,
  Home,
  LogIn,
  LogOut,
  MessageSquare,
  Trophy,
  User,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { logoutUser } from "../api/authApi";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-link" onClick={() => setIsMenuOpen(false)}>
          <Code2 size={18} /> Online Judge
        </Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`navbar-right ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}>
        <Link to="/"><Home size={16} /> Home</Link>
        <Link to="/problems"><Code2 size={16} /> Problems</Link>
        <Link to="/leaderboard"><Trophy size={16} /> Leaderboard</Link>
        <Link to="/discussions"><MessageSquare size={16} /> Discussions</Link>

        {isAuthenticated ? (
          <>
            <Link to="/study-planner"><Brain size={16} /> Study Planner</Link>
            <Link to="/mock-oa"><Bot size={16} /> Mock OA</Link>
            <Link to="/profile"><User size={16} /> Profile</Link>
            <div onClick={(e) => e.stopPropagation()}>
              <ThemeToggle />
            </div>

            <button onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <div onClick={(e) => e.stopPropagation()}>
              <ThemeToggle />
            </div>
            <Link to="/login"><LogIn size={16} /> Login</Link>
            <Link to="/register"><UserPlus size={16} /> Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
