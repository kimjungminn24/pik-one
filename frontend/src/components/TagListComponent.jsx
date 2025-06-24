import React from "react";
import Tag from "./Tag";

export default function TagListComponent({ items, selectedTags, onTagClick }) {
  return (
    <ul>
      {items.map((item) => (
        <Tag
          key={item.ko}
          item={item}
          onClick={onTagClick}
          isSelected={selectedTags.includes(item.ko)}
        />
      ))}
    </ul>
  );
}
