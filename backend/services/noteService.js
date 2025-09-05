const Note = require("../models/note");
const { MESSAGES } = require("../constants");

/**
 * Create a new note
 */
const createNote = async (noteData) => {
  const { clerkUserId, title, content, date, tags } = noteData;

  const note = new Note({
    clerkUserId,
    title,
    content,
    date: new Date(date),
    tags: tags || [],
  });

  const savedNote = await note.save();

  return {
    id: savedNote._id,
    title: savedNote.title,
    content: savedNote.content,
    date: savedNote.date,
    tags: savedNote.tags,
    createdOn: savedNote.createdOn,
  };
};

/**
 * Get all notes for a user
 */
const getUserNotes = async (clerkUserId) => {
  const notes = await Note.find({ clerkUserId })
    .sort({ createdOn: -1 })
    .select("-__v");

  return notes;
};

/**
 * Get a specific note by ID and user
 */
const getNoteById = async (noteId, clerkUserId) => {
  const note = await Note.findOne({ _id: noteId, clerkUserId });
  return note;
};

/**
 * Update a note
 */
const updateNote = async (noteId, clerkUserId, updateData) => {
  const { title, content, date, tags } = updateData;

  const note = await Note.findOne({ _id: noteId, clerkUserId });

  if (!note) {
    return null;
  }

  // Update fields if provided
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (date !== undefined) note.date = new Date(date);
  if (tags !== undefined) note.tags = tags;

  const updatedNote = await note.save();

  return {
    id: updatedNote._id,
    title: updatedNote.title,
    content: updatedNote.content,
    date: updatedNote.date,
    tags: updatedNote.tags,
    updatedOn: updatedNote.updatedOn,
  };
};

/**
 * Delete a note
 */
const deleteNote = async (noteId, clerkUserId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, clerkUserId });
  return note;
};

/**
 * Get note count for a user
 */
const getUserNoteCount = async (clerkUserId) => {
  const count = await Note.countDocuments({ clerkUserId });
  return count;
};

module.exports = {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getUserNoteCount,
};
