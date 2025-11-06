import React from "react";

function TagPills({ tags = [] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="tag-pills" aria-label="Recipe tags">
      {tags.map((t, idx) => (
        <span className="pill" key={`${t}-${idx}`}>
          <span className="dot" aria-hidden="true" />
          {t}
        </span>
      ))}
    </div>
  );
}

export default TagPills;
