import React, { useEffect, useMemo } from "react";
import SearchBar from "../components/SearchBar";
import RecipeGrid from "../components/RecipeGrid";
import Pagination from "../components/Pagination";
import { useRecipes } from "../state/recipesContext";
import { getIsDemoMode } from "../api/recipes";

// PUBLIC_INTERFACE
function Home() {
  /**
   * Home page. Lists recipes with search and pagination using global state.
   */
  const {
    state: { searchQuery, list, total, page, pageSize, loading, error },
    actions: { setQuery, setPage, refetchList },
  } = useRecipes();

  const demo = useMemo(() => getIsDemoMode(), []);

  useEffect(() => {
    refetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const onSearch = (q) => {
    setQuery(q);
  };

  const onPageChange = (p) => {
    setPage(p);
  };

  return (
    <div className="container">
      <section className="page-hero" aria-label="Search recipes">
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Find your next dish</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>
          Browse, search, and explore tasty recipes.{demo ? " (Demo data)" : ""}
        </p>
        <SearchBar initialQuery={searchQuery} onSearch={onSearch} />
      </section>

      <RecipeGrid items={list} loading={loading} error={error} onRetry={refetchList} />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </div>
  );
}

export default Home;
