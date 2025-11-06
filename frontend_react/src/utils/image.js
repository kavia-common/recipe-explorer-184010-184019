import { getPlaceholderImage } from "../assets";
//
// Image utilities to normalize recipe image URLs and provide fallbacks.
//
 
// PUBLIC_INTERFACE
export function getPlaceholder(kind = "card") {
  /**
   * Returns an imported placeholder image for recipes.
   * Uses ES module import so bundler includes it.
   */
  return getPlaceholderImage();
}
 
// PUBLIC_INTERFACE
export function normalizeRecipeImage(src) {
  /**
   * Ensures image URL is a safe, absolute path that CRA can serve.
   * - If src is falsy, returns a placeholder.
   * - If src is already absolute (starts with http or /), returns as-is.
   * - If src is relative like "assets/recipe-1.jpg", make it absolute "/assets/recipe-1.jpg".
   *
   * Note: Prefer using `imageUrl` attached by API layer (imported modules). This is a fallback.
   */
  const placeholder = getPlaceholder();
 
  if (!src || typeof src !== "string") return placeholder;
 
  const trimmed = src.trim();
  if (!trimmed) return placeholder;
 
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return trimmed;
  }
 
  // If it already begins with a slash, CRA will serve it from public root.
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
 
  // If it's something like "assets/recipe-1.jpg", normalize to "/assets/recipe-1.jpg"
  if (lower.startsWith("assets/")) {
    return `/${trimmed}`;
  }
 
  // As a conservative default, return as-is; consumer onError will swap placeholder if it 404s.
  return trimmed;
}
