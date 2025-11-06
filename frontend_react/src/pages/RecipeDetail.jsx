import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import TagPills from "../components/TagPills";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useRecipes } from "../state/recipesContext";
import { getIsDemoMode } from "../api/recipes";

// PUBLIC_INTERFACE
function RecipeDetail() {
  /**
   * Recipe detail page. Loads recipe by id on mount and shows details.
   */
  const { id } = useParams();
  const {
    state: { selectedRecipe, loading, error },
    actions: { fetchRecipeDetail },
  } = useRecipes();

  const demo = useMemo(() => getIsDemoMode(), []);

  useEffect(() => {
    if (id) fetchRecipeDetail(id);
  }, [id, fetchRecipeDetail]);

  if (loading && !selectedRecipe) return <div className="container"><Loader label="Loading recipe..." /></div>;
  if (error && !selectedRecipe) return <div className="container"><ErrorState message={error} onRetry={() => fetchRecipeDetail(id)} /></div>;
  if (!selectedRecipe) return <div className="container"><div className="empty">Recipe not found.</div></div>;

  const { title, image, tags = [], ingredients = [], instructions = "" } = selectedRecipe;

  return (
    <div className="container">
      <p style={{ marginBottom: 16 }}>
        <Link to="/" className="back-link" aria-label="Back to list">← Back to recipes</Link>
        {demo && <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>(Demo data)</span>}
      </p>
      <article className="recipe-detail" aria-label="Recipe details">
        <header className="recipe-detail-header">
          <h1 style={{ margin: 0 }}>{title}</h1>
          <TagPills tags={tags} />
        </header>
        <img
          className="recipe-detail-img"
          src={image || ""}
          alt={title || "Recipe image"}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='360'><rect width='100%' height='100%' fill='%2322262f'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='24'>No image available</text></svg>`);
          }}
        />
        <section>
          <h2>Ingredients</h2>
          <ul>
            {(ingredients || []).map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{instructions}</p>
        </section>
      </article>
    </div>
  );
}

export default RecipeDetail;
