import "./App.css";


function Navbar({ user, onNavigate }) {
  return (
    <header className="navbar">
      <button className="logo" type="button" onClick={() => onNavigate("/")}>
        <span className="logo-mark">S</span>
        <span>Skillter</span>
      </button>

      <nav>
        <button type="button" onClick={() => onNavigate("/leaderboard")}>
          Leaderboard
        </button>

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
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              <span aria-hidden="true" className="profile-symbol">
                <svg viewBox="0 0 24 24" role="img">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.6-4.3 4.2-6.5 8-6.5s6.4 2.2 8 6.5" />
                </svg>
              </span>
            )}
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
