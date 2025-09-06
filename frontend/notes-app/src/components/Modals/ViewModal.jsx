import React from "react";
import { MdClose } from "react-icons/md";
import ModalWrapper from "./ModalWrapper";

const ViewModal = ({ isOpen, onClose, noteData, onEdit }) => {
  if (!isOpen || !noteData) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="View Note"
      className="w-[85%] max-w-3xl mx-auto p-3 md:p-6 bg-surface rounded-lg overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="relative">
        <button
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-surface border border-border hover:bg-surface-light hover:border-primary transition-colors cursor-pointer z-10"
          onClick={onClose}
        >
          <MdClose className="text-lg md:text-xl text-text-muted hover:text-primary transition-colors" />
        </button>

        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-2 leading-tight">
            {noteData.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-text-light text-xs md:text-sm">
            <span>
              {new Date(noteData.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>
              Created: {new Date(noteData.createdOn).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold text-text mb-2 md:mb-3">
            Content
          </h2>
          <div className="bg-surface-light border border-border rounded-lg p-3 md:p-4 text-text leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {noteData.content}
          </div>
        </div>

        {noteData.tags && noteData.tags.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-text mb-2 md:mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {noteData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary/20 text-primary border border-primary/30 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-3 md:pt-4 border-t border-border">
          <button
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 md:py-3 px-6 md:px-8 rounded-lg transition-colors cursor-pointer text-sm md:text-base"
            onClick={onEdit}
          >
            Edit Note
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewModal;
