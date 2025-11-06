import React from "react";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import RecipeCard from "./RecipeCard";

function RecipeGrid({ items = [], loading, error, onRetry }) {
  if (loading) return <Loader label="Loading recipes..." />;
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
