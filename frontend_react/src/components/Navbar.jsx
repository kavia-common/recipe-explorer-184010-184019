import React from "react";
import { Link } from "react-router-dom";

function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="Recipe Explorer home">
          <span className="brand-badge" aria-hidden="true" />
          <span>Recipe Explorer</span>
        </Link>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
