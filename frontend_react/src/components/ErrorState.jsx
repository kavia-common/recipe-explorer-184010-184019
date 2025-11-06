import React from "react";

function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="error" role="alert">
      <div style={{ marginBottom: 8, color: "var(--color-error)" }}>⚠️ Error</div>
      <div style={{ marginBottom: 12 }}>{message}</div>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry} aria-label="Retry loading">
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
