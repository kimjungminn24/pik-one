import React from "react";
import Tag from "./TagComponent";
import "../css/tag.scss";

export default function TagListComponent({ items, isSelected, onTagClick }) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <Tag
          key={item.name}
          item={item}
          onClick={onTagClick}
          isSelected={isSelected(item)}
        />
      ))}
    </div>
  );
}
