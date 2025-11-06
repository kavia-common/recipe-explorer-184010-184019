import React, { createContext, useContext, useMemo, useReducer, useCallback } from "react";
import { fetchRecipeById, fetchRecipes } from "../api/recipes";

/**
 * Global state for recipes with Context + useReducer.
 */
const initialState = {
  searchQuery: "",
  filters: { tags: [] },
  list: [],
  total: 0,
  page: 1,
  pageSize: 12,
  loading: false,
  error: null,
  selectedRecipe: null,
};

const ActionTypes = {
  setQuery: "setQuery",
  setFilters: "setFilters",
  setPage: "setPage",
  fetchRecipesStart: "fetchRecipesStart",
  fetchRecipesSuccess: "fetchRecipesSuccess",
  fetchRecipesFailure: "fetchRecipesFailure",
  fetchRecipeDetailStart: "fetchRecipeDetailStart",
  fetchRecipeDetailSuccess: "fetchRecipeDetailSuccess",
  fetchRecipeDetailFailure: "fetchRecipeDetailFailure",
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.setQuery:
      return { ...state, searchQuery: action.payload, page: 1 };
    case ActionTypes.setFilters:
      return { ...state, filters: action.payload, page: 1 };
    case ActionTypes.setPage:
      return { ...state, page: action.payload };
    case ActionTypes.fetchRecipesStart:
      return { ...state, loading: true, error: null };
    case ActionTypes.fetchRecipesSuccess:
      return {
        ...state,
        loading: false,
        error: null,
        list: action.payload.items,
        total: action.payload.total,
      };
    case ActionTypes.fetchRecipesFailure:
      return { ...state, loading: false, error: action.payload };
    case ActionTypes.fetchRecipeDetailStart:
      return { ...state, loading: true, error: null, selectedRecipe: null };
    case ActionTypes.fetchRecipeDetailSuccess:
      return { ...state, loading: false, error: null, selectedRecipe: action.payload };
    case ActionTypes.fetchRecipeDetailFailure:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const RecipesContext = createContext(undefined);

// PUBLIC_INTERFACE
export function RecipesProvider({ children }) {
  /** Provides global recipe state and actions to the app */
  const [state, dispatch] = useReducer(reducer, initialState);

  // PUBLIC_INTERFACE
  const setQuery = useCallback((q) => {
    dispatch({ type: ActionTypes.setQuery, payload: q });
  }, []);

  // PUBLIC_INTERFACE
  const setFilters = useCallback((filters) => {
    dispatch({ type: ActionTypes.setFilters, payload: filters });
  }, []);

  // PUBLIC_INTERFACE
  const setPage = useCallback((page) => {
    dispatch({ type: ActionTypes.setPage, payload: page });
  }, []);

  // PUBLIC_INTERFACE
  const refetchList = useCallback(async () => {
    dispatch({ type: ActionTypes.fetchRecipesStart });
    try {
      const result = await fetchRecipes({
        q: state.searchQuery,
        tags: state.filters?.tags || [],
        page: state.page,
        pageSize: state.pageSize,
      });
      dispatch({
        type: ActionTypes.fetchRecipesSuccess,
        payload: { items: result.items, total: result.total },
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.fetchRecipesFailure,
        payload: err?.message || "Failed to fetch recipes",
      });
    }
  }, [state.searchQuery, state.filters, state.page, state.pageSize]);

  // PUBLIC_INTERFACE
  const fetchRecipeDetail = useCallback(async (id) => {
    dispatch({ type: ActionTypes.fetchRecipeDetailStart });
    try {
      const data = await fetchRecipeById(id);
      dispatch({ type: ActionTypes.fetchRecipeDetailSuccess, payload: data });
    } catch (err) {
      dispatch({
        type: ActionTypes.fetchRecipeDetailFailure,
        payload: err?.message || "Failed to fetch recipe",
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      actions: { setQuery, setFilters, setPage, refetchList, fetchRecipeDetail },
    }),
    [state, setQuery, setFilters, setPage, refetchList, fetchRecipeDetail]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useRecipes() {
  /** Hook to consume global recipes state */
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipesProvider");
  return ctx;
}
