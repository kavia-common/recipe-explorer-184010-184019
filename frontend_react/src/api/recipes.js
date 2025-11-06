import { fetchJSON } from "./client";

/**
Assumed backend API schema:

GET /recipes?q=&tags=tag&tags=tag&page=1&pageSize=12
  -> { items: [{ id, title, image, tags:[], ingredients:[], instructions }], total: 123 }

GET /recipes/:id
  -> { id, title, image, tags:[], ingredients:[], instructions }
*/

// PUBLIC_INTERFACE
export async function fetchRecipes({ q = "", tags = [], page = 1, pageSize = 12 } = {}) {
  /** Fetch recipes list with search and pagination. */
  const params = { q, page, pageSize };
  if (Array.isArray(tags) && tags.length) params.tags = tags;
  const data = await fetchJSON("/recipes", { params });
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: Number.isFinite(data?.total) ? data.total : 0,
  };
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id) {
  /** Fetch a single recipe by id. */
  if (!id) throw new Error("Recipe id is required");
  const data = await fetchJSON(`/recipes/${encodeURIComponent(id)}`);
  return {
    id: data?.id ?? id,
    title: data?.title ?? "Untitled",
    image: data?.image ?? "",
    tags: Array.isArray(data?.tags) ? data.tags : [],
    ingredients: Array.isArray(data?.ingredients) ? data.ingredients : [],
    instructions: data?.instructions ?? "",
  };
}
