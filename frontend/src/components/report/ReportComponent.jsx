import { useState } from "react";
import CategorySelector from "./CategorySelector";
import NicknameBox from "./NicknameBox";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import "../../css/report.scss";
import {
  emojiList,
  randomColorList,
  nicknameOptions,
} from "../../utils/reportOptions";
import { useCreateIssue, useGetIssues } from "../../hooks/useIssue";
import LoadingSpinner from "../LoadingSpinner";
import { useTranslation } from "react-i18next";

export default function ReportComponent({ enabled, outro }) {
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ja")
    ? "ja"
    : i18n.language.startsWith("en")
      ? "en"
      : "ko";
  const { prefix, core } = nicknameOptions[lang];

  const { data: list, isLoading } = useGetIssues(enabled);

  const [bgColor, setBgColor] = useState(getRandomElement(randomColorList));
  const [emoji, setEmoji] = useState(getRandomElement(emojiList));
  const [nickname, setNickname] = useState(
    `${getRandomElement(prefix)} ${getRandomElement(core)}`,
  );
  const [selectedCategory, setSelectedCategory] = useState("bug");
  const [commentText, setCommentText] = useState("");

  const handleEmojiClick = () => {
    setEmoji(getRandomElement(emojiList));
    setBgColor(getRandomElement(randomColorList));
  };

  const handleNicknameRandomize = () => {
    setNickname(`${getRandomElement(prefix)} ${getRandomElement(core)}`);
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
  2,
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
      createdAt: new Date().toISOString().slice(0, 10),
      answer: null,
    };

    const commentBody = buildGithubComment(newComment);

    setCommentText("");
    mutation.mutate({ body: commentBody });
  };

  return (
    <div className="shell report">
      <aside className="shell__panel">
        <section className="panel-section report-compose">
          <NicknameBox
            emoji={emoji}
            bgColor={bgColor}
            nickname={nickname}
            onEmojiClick={handleEmojiClick}
            onNicknameChange={setNickname}
            onRandomize={handleNicknameRandomize}
          />

          <CategorySelector
            categoryList={[
              { code: "cheer", label: t("report.category.cheer") },
              { code: "bug", label: t("report.category.bug") },
              { code: "suggestion", label: t("report.category.suggestion") },
            ]}
            selected={selectedCategory}
            onSelect={(c) => setSelectedCategory(c.code)}
          />

          <CommentForm
            text={commentText}
            onChange={setCommentText}
            onSubmit={handleSubmitComment}
          />
        </section>
        {outro}
      </aside>

      <section className="shell__main report-feed">
        <div className="report-feed__head">
          <h2 className="panel-section__title report-feed__title">
            {t("report.list_title")}
            {!isLoading && list && (
              <span className="panel-section__count">{list.length}</span>
            )}
          </h2>
        </div>
        {isLoading ? (
          <LoadingSpinner message={t("report.loading")} />
        ) : (
          <CommentList list={list} />
        )}
      </section>
    </div>
  );
}
