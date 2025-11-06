//
// Centralized asset imports for recipe images.
// Import images as ES modules so bundler includes and optimizes them.
//

// Sample recipe images (align keys with tokens like "recipe-1", "recipe-2", ...)
import recipe1 from "./recipe-1.jpg";
import recipe2 from "./recipe-2.jpg";
import recipe3 from "./recipe-3.jpg";
import recipe4 from "./recipe-4.jpg";
import recipe5 from "./recipe-5.jpg";
import recipe6 from "./recipe-6.jpg";
import recipe7 from "./recipe-7.jpg";
import recipe8 from "./recipe-8.jpg";

// Placeholder image (used as fallback)
import placeholderImg from "./placeholder-recipe-1.jpg";

// PUBLIC_INTERFACE
export const recipeImages = {
  /** Map of known recipe image keys to imported URLs. */
  "recipe-1": recipe1,
  "recipe-2": recipe2,
  "recipe-3": recipe3,
  "recipe-4": recipe4,
  "recipe-5": recipe5,
  "recipe-6": recipe6,
  "recipe-7": recipe7,
  "recipe-8": recipe8,
};

// PUBLIC_INTERFACE
export function getRecipeImageByKey(key) {
  /** Returns the imported image URL for a given key, or undefined if not found. */
  if (!key) return undefined;
  return recipeImages[key];
}

// PUBLIC_INTERFACE
export function getPlaceholderImage() {
  /** Returns the placeholder image URL (imported via ES module). */
  return placeholderImg;
}
