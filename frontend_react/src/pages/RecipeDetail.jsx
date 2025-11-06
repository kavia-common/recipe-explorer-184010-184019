import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import TagPills from "../components/TagPills";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useRecipes } from "../state/recipesContext";
import { getIsDemoMode } from "../api/recipes";
import { normalizeRecipeImage, getPlaceholder } from "../utils/image";

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
  const imgSrc = normalizeRecipeImage(image);
  const placeholder = getPlaceholder("detail");

  return (
    <div className="container">
      <p style={{ marginBottom: 16 }}>
        <Link to="/" className="back-link" aria-label="Back to list">← Back to recipes</Link>
        {demo && <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>(Demo data)</span>}
      </p>
      <article className="recipe-detail" aria-label="Recipe details">
        <div className="detail-hero">
          <img
            src={imgSrc}
            alt={title || "Recipe image"}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.dataset.fallbackTried !== "true") {
                e.currentTarget.dataset.fallbackTried = "true";
                e.currentTarget.src = placeholder;
                return;
              }
              e.currentTarget.src =
                "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='700'><rect width='100%' height='100%' fill='%2322262f'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='24'>No image available</text></svg>`
                );
            }}
          />
          <div className="overlay" aria-hidden="true"></div>
          <div className="title-wrap">
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.15 }}>{title}</h1>
            <div style={{ marginTop: 8 }}>
              <TagPills tags={tags} />
            </div>
          </div>
        </div>

        <header className="recipe-detail-header" style={{ marginTop: 4 }}>
          <div className="recipe-meta" aria-label="Recipe meta" />
        </header>

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
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 16 }}>{instructions}</p>
        </section>
      </article>
    </div>
  );
}

export default RecipeDetail;
