import React, { useState } from "react";

function SearchBar({ initialQuery = "", onSearch }) {
  const [query, setQuery] = useState(initialQuery);

  const onSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <form className="searchbar" onSubmit={onSubmit} role="search" aria-label="Recipe search">
      <input
        type="text"
        aria-label="Search recipes"
        placeholder="Search recipes (e.g., pasta, chicken)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn" type="submit" aria-label="Submit search">Search</button>
    </form>
  );
}

export default SearchBar;
