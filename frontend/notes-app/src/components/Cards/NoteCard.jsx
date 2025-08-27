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
      className="border border-border rounded-lg p-4 bg-surface hover:bg-surface-light hover:shadow-xl hover:border-primary/30 hover:glow-effect transition-all ease-in-out cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-lg font-medium text-text">{title}</h6>
          <span className="text-sm text-text-light">{date}</span>
        </div>
      </div>

      <p className="text-text-light mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-text-muted">{tags}</div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <MdDelete
            className="icon-btn hover:text-error"
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
