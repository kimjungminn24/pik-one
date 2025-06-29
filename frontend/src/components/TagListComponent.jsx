import React from "react";
import Tag from "./TagComponent";

export default function TagListComponent({ items, isSelected, onTagClick }) {
  return (
    <div className="taglist">
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
