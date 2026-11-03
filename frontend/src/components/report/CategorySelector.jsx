import React from "react";
import "../../css/tag.scss";

export default function CategorySelector({ categoryList, selected, onSelect }) {
  return (
    <div className="report-category" role="radiogroup">
      {categoryList.map((category) => (
        <button
          key={category.code}
          type="button"
          role="radio"
          aria-checked={selected === category.code}
          className={`tag ${selected === category.code ? "tag--selected" : ""}`}
          onClick={() => onSelect(category)}
        >
          <span className="tag__name">{category.label}</span>
        </button>
      ))}
    </div>
  );
}
