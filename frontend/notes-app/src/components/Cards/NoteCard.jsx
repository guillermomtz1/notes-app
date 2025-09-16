import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  onEdit,
  onDelete,
  onClick,
}) => {
  // Detect money ($50K, $1,200, $1.2M), percentages (45%, 67.5%), or numbers with plus (10+, 10K+)
  const numberTokenRegex =
    /^(?:\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:[kKmMbB])?|\$?\d+(?:\.\d+)?(?:[kKmMbB])?|\d+(?:\.\d+)?%|\d+(?:[kKmM])?\+)$/
      .source;
  const numberMatcher = new RegExp(numberTokenRegex);

  const renderWithHighlights = (text) => {
    if (!text) return null;
    const tokens = String(text).match(/\s+|[^\s]+/g) || [text];
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (numberMatcher.test(token)) {
        result.push(
          <span
            key={`badge-${i}`}
            style={{
              background:
                "linear-gradient(90deg, rgba(119,67,219,0.15), rgba(93,43,184,0.15))",
              color: "var(--color-text)",
              border: "1px solid var(--color-border-light)",
              borderRadius: "8px",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.75rem",
              lineHeight: "1rem",
              display: "inline-flex",
              alignItems: "center",
            }}
            className="align-middle"
          >
            {token}
          </span>
        );
      } else {
        result.push(<span key={`t-${i}`}>{token}</span>);
      }
    }
    return result;
  };

  return (
    <div
      className="relative border border-border rounded-2xl p-6 bg-surface shadow-md hover:shadow-xl hover:border-primary/30 hover:bg-surface-light hover:glow-effect transition-all ease-in-out cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs tracking-wide uppercase text-text-muted mb-1">
            {date}
          </div>
          <h3 className="text-2xl font-semibold leading-snug text-text">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MdCreate
            className="icon-btn-green hover:text-secondary transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <MdDelete
            className="icon-btn hover:text-error transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      </div>

      <div className="h-px bg-border/70 my-4" />

      <ul className="text-text-light mt-2 text-base leading-relaxed space-y-3 list-disc pl-5 pb-2">
        {content
          ?.split("\n")
          .filter((line) => line.trim() !== "")
          .slice(0, 5)
          .map((line, index) => (
            <li key={index}>{renderWithHighlights(line)}</li>
          ))}
      </ul>

      {/* Bottom meta */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-text-muted truncate">{tags}</div>
      </div>
    </div>
  );
};

export default NoteCard;
