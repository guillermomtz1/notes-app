import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface hover:bg-surface-light hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-lg font-medium text-text">{title}</h6>
          <span className="text-sm text-text-light">{date}</span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-primary" : "text-text-muted"
          }`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-text-light mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-text-muted">{tags}</div>
        <div className="flex items-center gap-2">
          <MdCreate className="icon-btn hover:text-primary" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-error" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
