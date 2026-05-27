import "./App.css";


function Navbar({ user, onNavigate }) {
  return (
    <header className="navbar">
      <button className="logo" type="button" onClick={() => onNavigate("/")}>
        <span className="logo-mark">S</span>
        <span>Skillter</span>
      </button>

      <nav>
        <button type="button" onClick={() => onNavigate("/problems")}>
          Problems
        </button>

        {user ? (
          <button
            className="profile-icon"
            type="button"
            onClick={() => onNavigate("/profile")}
            title="Profile"
          >
            {user.firstName?.charAt(0) || "P"}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => onNavigate("/login")}>
              Login
            </button>
            <button type="button" onClick={() => onNavigate("/register")}>
              Register
            </button>
            <button type="button" onClick={() => onNavigate("/googleLogin")}>
              Google
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;