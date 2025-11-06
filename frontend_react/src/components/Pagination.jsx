import React from "react";

function Pagination({ page = 1, pageSize = 12, total = 0, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={p === page ? "active" : ""}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange?.(p)}
        >
          {p}
        </button>
      ))}
    </nav>
  );
}

export default Pagination;
