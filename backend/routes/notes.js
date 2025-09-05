const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const {
  validateNoteCreation,
  validateNoteUpdate,
} = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendSuccess, sendNotFoundError } = require("../utils/response");
const { MESSAGES, HTTP_STATUS } = require("../constants");
const noteService = require("../services/noteService");
const router = express.Router();

// Create a new note
router.post(
  "/",
  authenticateUser,
  validateNoteCreation,
  asyncHandler(async (req, res) => {
    const { title, content, date, tags } = req.body;
    const clerkUserId = req.user.sub;

    console.log("Incoming create note payload:", {
      title,
      hasContent: !!content,
      date,
      tagsCount: Array.isArray(tags) ? tags.length : 0,
      clerkUserId,
    });

    const note = await noteService.createNote({
      clerkUserId,
      title,
      content,
      date,
      tags,
    });

    sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.NOTE_CREATED, { note });
  })
);

// Get all notes for the authenticated user
router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const clerkUserId = req.user.sub;
    const notes = await noteService.getUserNotes(clerkUserId);

    sendSuccess(res, HTTP_STATUS.OK, null, {
      notes,
      count: notes.length,
    });
  })
);

// Get a specific note
router.get(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clerkUserId = req.user.sub;

    const note = await noteService.getNoteById(id, clerkUserId);

    if (!note) {
      return sendNotFoundError(res);
    }

    sendSuccess(res, HTTP_STATUS.OK, null, { note });
  })
);

// Update a note
router.put(
  "/:id",
  authenticateUser,
  validateNoteUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, date, tags } = req.body;
    const clerkUserId = req.user.sub;

    const note = await noteService.updateNote(id, clerkUserId, {
      title,
      content,
      date,
      tags,
    });

    if (!note) {
      return sendNotFoundError(res);
    }

    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.NOTE_UPDATED, { note });
  })
);

// Delete a note
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clerkUserId = req.user.sub;

    const note = await noteService.deleteNote(id, clerkUserId);

    if (!note) {
      return sendNotFoundError(res);
    }

    sendSuccess(res, HTTP_STATUS.OK, MESSAGES.NOTE_DELETED);
  })
);

module.exports = router;
