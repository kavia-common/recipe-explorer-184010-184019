import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function NotFound() {
  /** Fallback for unknown routes */
  return (
    <div className="container">
      <div className="error">
        <h1 style={{ marginTop: 0 }}>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn" aria-label="Go back home">Go Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
