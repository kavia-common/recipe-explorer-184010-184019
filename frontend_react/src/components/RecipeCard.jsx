import React from "react";
import { useNavigate } from "react-router-dom";
import TagPills from "./TagPills";
import { normalizeRecipeImage, getPlaceholder } from "../utils/image";
import { recipeImages } from "../assets";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  if (!recipe) return null;

  const { id, title, image, imageUrl, imageKey, tags = [] } = recipe;

  const onOpen = () => {
    navigate(`/recipes/${id}`);
  };

  // Prefer API-provided imageUrl (module import). Fallbacks: imageKey -> map, normalize legacy `image`.
  const resolved =
    imageUrl ||
    (imageKey && recipeImages[imageKey]) ||
    normalizeRecipeImage(image);
  const placeholder = getPlaceholder("card");

  return (
    <article className="card" role="article">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open recipe ${title}`}
        style={{ all: "unset", cursor: "pointer" }}
      >
        <img
          src={resolved}
          alt={title || "Recipe image"}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // First, try placeholder import; if that also fails, use inline SVG.
            if (e.currentTarget.dataset.fallbackTried !== "true") {
              e.currentTarget.dataset.fallbackTried = "true";
              e.currentTarget.src = placeholder;
              return;
            }
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'>No image</text></svg>`
              );
          }}
        />
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <TagPills tags={tags} />
        </div>
      </button>
    </article>
  );
}

export default RecipeCard;
