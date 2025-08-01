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
import { useCreateIssue, useGetIssues } from "../../hooks/useIssue";

export default function ReportComponent({ enabled }) {
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const { data: list, isLoading } = useGetIssues(enabled);

  const [bgColor, setBgColor] = useState(getRandomElement(randomColorList));
  const [emoji, setEmoji] = useState(getRandomElement(emojiList));
  const [nickname, setNickname] = useState(
    `${getRandomElement(nicknamePrefixList)} ${getRandomElement(
      nicknameCoreList
    )}`
  );
  const [selectedCategory, setSelectedCategory] = useState("버그");
  const [commentText, setCommentText] = useState("");

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

  const buildGithubComment = ({
    emoji,
    category,
    bgColor,
    nickname,
    comment,
    createdAt,
    answer,
  }) => {
    return `
-  **닉네임**: ${emoji} ${nickname}  
-  **카테고리**: ${category}  
-  **작성 시간**: ${new Date(createdAt).toLocaleString()}  
-  **내용**: ${comment}  
-  **답변**: ${answer ? answer : "아직 없음"}

<!-- ISSUE_START
${JSON.stringify(
  { emoji, category, bgColor, nickname, comment, createdAt, answer },
  null,
  2
)}
ISSUE_END -->
  `.trim();
  };

  const mutation = useCreateIssue();
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      category: selectedCategory,
      emoji,
      bgColor,
      nickname,
      comment: commentText,
      createdAt: new Date().toISOString(),
      answer: null,
    };

    const commentBody = buildGithubComment(newComment);

    setCommentText("");
    mutation.mutate({ body: commentBody });
  };

  return (
    <div className="report">
      <CategorySelector
        categoryList={["버그", "제안", "응원"]}
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

      <CommentList list={list} />
    </div>
  );
}
