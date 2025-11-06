import { fetchJSON } from "./client";
import sampleData from "../data/sampleRecipes.json";
import { getRecipeImageByKey, recipeImages, getPlaceholderImage } from "../assets";

/**
Assumed backend API schema:

GET /recipes?q=&tags=tag&tags=tag&page=1&pageSize=12
  -> { items: [{ id, title, image, tags:[], ingredients:[], instructions }], total: 123 }

GET /recipes/:id
  -> { id, title, image, tags:[], ingredients:[], instructions }
*/

function isDemoMode() {
  const flag = (process.env.REACT_APP_DEMO_MODE || "").toLowerCase().trim();
  return flag === "true" || flag === "1" || (!process.env.REACT_APP_API_BASE && !process.env.REACT_APP_BACKEND_URL);
}

/**
 * Try to infer an image key from a legacy path like "/assets/recipe-1.jpg"
 * Returns something like "recipe-1" or undefined if not inferred.
 */
function toImageKeyFromPath(src) {
  if (!src || typeof src !== "string") return undefined;
  const m = src.match(/(?:^|\/)(recipe-\d+)\.(?:jpg|jpeg|png|webp)$/i);
  return m ? m[1] : undefined;
}

function attachImageUrl(item) {
  // Prefer an explicit imageKey if present, otherwise infer from image field.
  const key = item.imageKey || toImageKeyFromPath(item.image);
  const url = (key && getRecipeImageByKey(key)) || getPlaceholderImage();
  return { ...item, imageKey: key, imageUrl: url };
}

function filterAndPaginateLocal({ q = "", tags = [], page = 1, pageSize = 12 }) {
  const term = (q || "").toLowerCase();
  const tagSet = new Set((tags || []).map((t) => String(t).toLowerCase()));
  let items = Array.isArray(sampleData?.items) ? [...sampleData.items] : [];

  if (term) {
    items = items.filter((r) => {
      const hay = `${r.title} ${r.tags?.join(" ")} ${r.ingredients?.join(" ")} ${r.instructions}`.toLowerCase();
      return hay.includes(term);
    });
  }
  if (tagSet.size > 0) {
    items = items.filter((r) => (r.tags || []).some((t) => tagSet.has(String(t).toLowerCase())));
  }

  const total = items.length;
  const start = Math.max(0, (page - 1) * pageSize);
  const paged = items.slice(start, start + pageSize).map(attachImageUrl);
  return { items: paged, total };
}

// PUBLIC_INTERFACE
export async function fetchRecipes({ q = "", tags = [], page = 1, pageSize = 12 } = {}) {
  /** Fetch recipes list with search and pagination. Falls back to local data in demo mode or on fetch failure. */
  if (isDemoMode()) {
    return filterAndPaginateLocal({ q, tags, page, pageSize });
  }

  const params = { q, page, pageSize };
  if (Array.isArray(tags) && tags.length) params.tags = tags;

  try {
    const data = await fetchJSON("/recipes", { params });
    // When using real backend, pass through image as-is but do not break demo rendering.
    const items = Array.isArray(data?.items) ? data.items.map((it) => {
      // If backend provides imageKey, use module; else keep provided URL.
      const url = it.imageKey && recipeImages[it.imageKey] ? recipeImages[it.imageKey] : (it.image || "");
      return { ...it, imageUrl: url || getPlaceholderImage() };
    }) : [];
    return {
      items,
      total: Number.isFinite(data?.total) ? data.total : 0,
    };
  } catch (err) {
    // graceful fallback to local sample data
    return filterAndPaginateLocal({ q, tags, page, pageSize });
  }
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id) {
  /** Fetch a single recipe by id. Falls back to local data. */
  if (!id) throw new Error("Recipe id is required");

  if (isDemoMode()) {
    const local = (sampleData.items || []).find((r) => r.id === id);
    if (!local) throw new Error("Recipe not found");
    return attachImageUrl(local);
  }

  try {
    const data = await fetchJSON(`/recipes/${encodeURIComponent(id)}`);
    const url = data?.imageKey && recipeImages[data.imageKey] ? recipeImages[data.imageKey] : (data?.image || "");
    return {
      id: data?.id ?? id,
      title: data?.title ?? "Untitled",
      image: data?.image ?? "",
      imageKey: data?.imageKey,
      imageUrl: url || getPlaceholderImage(),
      tags: Array.isArray(data?.tags) ? data.tags : [],
      ingredients: Array.isArray(data?.ingredients) ? data.ingredients : [],
      instructions: data?.instructions ?? "",
    };
  } catch (err) {
    const local = (sampleData.items || []).find((r) => r.id === id);
    if (!local) throw err;
    return attachImageUrl(local);
  }
}

export function getIsDemoMode() {
  /** Returns whether demo mode is active based on env or lack of API base. */
  return isDemoMode();
}
