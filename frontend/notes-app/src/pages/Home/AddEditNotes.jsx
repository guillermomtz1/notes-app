import React, { useState, useRef } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose, MdFormatListBulleted, MdCalendarToday } from "react-icons/md";

const AddEditNotes = ({ type, noteData, onClose, onSubmit }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [selectedDate, setSelectedDate] = useState(
    noteData?.date
      ? new Date(noteData.date).toISOString().split("T")[0]
      : new Date().toLocaleDateString("en-CA")
  );
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);

  const handleAddNote = async () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    setError("");

    const submitData = {
      title,
      content,
      date: selectedDate,
      tags,
      ...(noteData?.id && { id: noteData.id }), // Include ID if editing
    };

    if (onSubmit) {
      try {
        const result = await onSubmit(submitData);
        if (result) {
          // Clear form on success
          setTitle("");
          setContent("");
          setSelectedDate(new Date().toLocaleDateString("en-CA"));
          setTags([]);
        }
      } catch (error) {
        console.error("Error submitting note:", error);
        setError("Failed to create note. Please try again.");
      }
    } else {
      setError("Form submission not configured");
    }
  };

  // Insert bullet point at cursor position
  const insertBullet = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = content;

    // Get the current line
    const beforeCursor = currentValue.substring(0, start);
    const afterCursor = currentValue.substring(end);
    const lines = beforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Check if we're at the start of a line or if the line already has a bullet
    const isAtLineStart = beforeCursor.endsWith("\n") || beforeCursor === "";
    const hasBullet =
      currentLine.trim().startsWith("- ") ||
      currentLine.trim().startsWith("• ");

    let newContent;
    if (isAtLineStart || hasBullet) {
      // Insert bullet at current position
      newContent = beforeCursor + "- " + afterCursor;
    } else {
      // Insert bullet at the beginning of the current line
      const lineStart = beforeCursor.lastIndexOf("\n") + 1;
      newContent =
        currentValue.substring(0, lineStart) +
        "- " +
        currentValue.substring(lineStart);
    }

    setContent(newContent);

    // Set cursor position after the bullet
    setTimeout(() => {
      const newPosition = start + 2; // +2 for "- "
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      insertBullet();
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <button
        className="w-7 h-7 rounded-full flex items-center justify-center absolute -top-2 -right-3 bg-surface border border-border hover:bg-surface-light hover:border-primary transition-colors cursor-pointer"
        onClick={onClose}
      >
        <MdClose className="text-xl text-text-muted hover:text-primary transition-colors" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-light uppercase tracking-wide">
          TITLE
        </label>
        <input
          type="text"
          className="text-2xl text-text bg-surface border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
          placeholder="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-sm font-medium text-text-light uppercase tracking-wide">
          DATE
        </label>
        <div className="relative">
          <input
            type="date"
            className="w-full text-text bg-surface border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity"
            value={selectedDate}
            onChange={({ target }) => setSelectedDate(target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-light uppercase tracking-wide">
            CONTENT
          </label>
          <button
            onClick={insertBullet}
            className="p-2 text-text-muted hover:text-primary hover:bg-surface-light rounded transition-colors"
            title="Add bullet point (Ctrl+L)"
          >
            <MdFormatListBulleted className="text-lg" />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          type="text"
          className="text-sm text-text bg-surface border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none leading-relaxed flex-1 overflow-y-auto min-h-0"
          placeholder="Share your achievements and impact...

• What did you contribute? (design, development, insights)
• Who benefited from this work?
• What were the measurable results?
• Any key metrics or improvements?

Write your story here..."
          rows={5}
          value={content}
          onChange={({ target }) => setContent(target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="mt-3">
        <label className="text-sm font-medium text-text-white uppercase tracking-wide">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

      <button
        className="btn-primary font-medium mt-4 p-2"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
