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
  return (
    <div
      className="relative border border-border rounded-lg p-4 bg-surface hover:bg-surface-light hover:shadow-xl hover:border-primary/30 hover:glow-effect transition-all ease-in-out cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-lg font-medium text-text">{title}</h6>
          <span className="text-sm text-text-light">{date}</span>
        </div>
      </div>

      <div className="text-text-light mt-2 text-sm leading-relaxed pb-16">
        {content
          ?.split("\n")
          .slice(0, 3)
          .map((line, index) => (
            <div key={index} className="mb-1">
              {line || "\u00A0"}
            </div>
          ))}
        {content?.split("\n").length > 3 && (
          <div className="text-text-muted text-xs mt-1">...</div>
        )}
      </div>

      {/* Bottom elements - positioned absolutely */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="text-xs text-text-muted">{tags}</div>
        <div className="flex items-center gap-2">
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
    </div>
  );
};

export default NoteCard;
