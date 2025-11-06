import React from "react";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import RecipeCard from "./RecipeCard";

function RecipeGrid({ items = [], loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="skeleton-grid" role="status" aria-label="Loading recipes">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-img" />
            <div className="skeleton-body">
              <div className="skeleton-line" style={{ width: "70%" }} />
              <div className="skeleton-line" style={{ width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items || items.length === 0)
    return <div className="empty">No recipes found. Try a different search.</div>;

  return (
    <div className="grid">
      {items.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}

export default RecipeGrid;
