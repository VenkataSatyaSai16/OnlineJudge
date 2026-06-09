import { Link , useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logoutUser } from "../api/authApi";

function Navbar() {
  //const {user} = useAuth();
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

  <div className="navbar-left">
    <Link to="/">Home</Link>
  </div>
  <div className="navbar-right">
    <Link to="/problems">Problems</Link>
    <Link to="/leaderboard">Leaderboard</Link>

    {isAuthenticated ? (
      <>
        <Link to="/profile">Profile</Link>

        <button onClick={handleLogout}>
          Logout
        </button>
      </>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>
    )}
  </div>

</nav>
  );
}

export default Navbar;
