import React, { useState } from "react";
import CategorySelector from "./CategorySelector";
import NicknameBox from "./NicknameBox";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import "../../css/report.scss";
import {
  emojiList,
  nicknamePrefixList,
  nicknameCoreList,
  randomColorList,
} from "../../utils/reportOptions";

export default function ReportComponent() {
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const [bgColor, setBgColor] = useState(getRandomElement(randomColorList));
  const [emoji, setEmoji] = useState(getRandomElement(emojiList));
  const [nickname, setNickname] = useState(
    `${getRandomElement(nicknamePrefixList)} ${getRandomElement(
      nicknameCoreList
    )}`
  );
  const [selectedCategory, setSelectedCategory] = useState("버그");
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState([]);

  const handleEmojiClick = () => {
    setEmoji(getRandomElement(emojiList));
    setBgColor(getRandomElement(randomColorList));
  };

  const handleNicknameRandomize = () => {
    setNickname(
      `${getRandomElement(nicknamePrefixList)} ${getRandomElement(
        nicknameCoreList
      )}`
    );
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      category: selectedCategory,
      emoji,
      bgColor,
      nickname,
      comment: commentText,
      createdAt: new Date().toLocaleString("ko-KR", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setCommentList((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  return (
    <div className="report">
      <CategorySelector
        categoryList={["버그", "제안", "칭찬"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <NicknameBox
        emoji={emoji}
        bgColor={bgColor}
        nickname={nickname}
        onEmojiClick={handleEmojiClick}
        onNicknameChange={setNickname}
        onRandomize={handleNicknameRandomize}
      />

      <CommentForm
        text={commentText}
        onChange={setCommentText}
        onSubmit={handleSubmitComment}
      />

      <CommentList list={commentList} />
    </div>
  );
}
