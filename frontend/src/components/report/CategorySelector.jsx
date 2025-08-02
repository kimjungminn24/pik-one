import React from "react";

export default function CategorySelector({ categoryList, selected, onSelect }) {
  return (
    <div className="report-category">
      {categoryList.map((category) => (
        <div
          key={category}
          className={`report-category-item ${
            selected === category ? "active" : ""
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
}
