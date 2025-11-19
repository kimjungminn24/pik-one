import React from "react";

export default function CategorySelector({ categoryList, selected, onSelect }) {
  return (
    <div className="report-category">
      {categoryList.map((category) => (
        <div
          key={category.code}
          className={`report-category-item ${
            selected === category.code ? "active" : ""
          }`}
          onClick={() => onSelect(category)}
        >
          {category.label}
        </div>
      ))}
    </div>
  );
}
