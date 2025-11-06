import { fetchJSON } from "./client";
import sampleData from "../data/sampleRecipes.json";

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
  const paged = items.slice(start, start + pageSize);
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
    return {
      items: Array.isArray(data?.items) ? data.items : [],
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
    return local;
  }

  try {
    const data = await fetchJSON(`/recipes/${encodeURIComponent(id)}`);
    return {
      id: data?.id ?? id,
      title: data?.title ?? "Untitled",
      image: data?.image ?? "",
      tags: Array.isArray(data?.tags) ? data.tags : [],
      ingredients: Array.isArray(data?.ingredients) ? data.ingredients : [],
      instructions: data?.instructions ?? "",
    };
  } catch (err) {
    const local = (sampleData.items || []).find((r) => r.id === id);
    if (!local) throw err;
    return local;
  }
}

export function getIsDemoMode() {
  /** Returns whether demo mode is active based on env or lack of API base. */
  return isDemoMode();
}
