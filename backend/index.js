const mongoose = require("mongoose");
const { verifyToken } = require("@clerk/backend");

// Load environment variables
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const Note = require("./models/note");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Clerk authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: true, message: "No token provided" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    if (!payload || !payload.sub) {
      console.error("Auth error: Missing 'sub' in token payload", payload);
      return res
        .status(401)
        .json({ error: true, message: "Invalid token payload" });
    }
    req.user = payload;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: true, message: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create a new note
app.post("/api/notes", authenticateUser, async (req, res) => {
  try {
    console.log("Create note content-type:", req.headers["content-type"]);
    console.log("Create note req.body:", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Empty JSON body received" });
    }
    const { title, content, date, tags } = req.body;
    const clerkUserId = req.user.sub;

    if (!clerkUserId) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized: missing user id" });
    }

    console.log("Incoming create note payload:", {
      title,
      hasContent: !!content,
      date,
      tagsCount: Array.isArray(tags) ? tags.length : 0,
      clerkUserId,
    });

    if (!title || !content || !date) {
      return res.status(400).json({
        error: true,
        message: "Title, content, and date are required",
      });
    }

    const note = new Note({
      clerkUserId,
      title,
      content,
      date: new Date(date),
      tags: tags || [],
    });

    await note.save();

    res.json({
      success: true,
      message: "Note created successfully",
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        date: note.date,
        tags: note.tags,
        createdOn: note.createdOn,
      },
    });
  } catch (error) {
    console.error("Create note error:", error?.message || error);
    if (error?.stack) {
      console.error(error.stack);
    }
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || "Failed to create note"
        : "Failed to create note";
    res.status(500).json({ error: true, message });
  }
});

// Get all notes for the authenticated user
app.get("/api/notes", authenticateUser, async (req, res) => {
  try {
    const clerkUserId = req.user.sub;

    const notes = await Note.find({ clerkUserId })
      .sort({ createdOn: -1 })
      .select("-__v");

    res.json({
      success: true,
      notes: notes,
      count: notes.length,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch notes" });
  }
});

// Get a specific note
app.get("/api/notes/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = req.user.sub;

    const note = await Note.findOne({ _id: id, clerkUserId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, note });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch note" });
  }
});

// Update a note
app.put("/api/notes/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date, tags } = req.body;
    const clerkUserId = req.user.sub;

    const note = await Note.findOne({ _id: id, clerkUserId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.date = date ? new Date(date) : note.date;
    note.tags = tags || note.tags;

    await note.save();

    res.json({
      success: true,
      message: "Note updated successfully",
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        date: note.date,
        tags: note.tags,
        updatedOn: note.updatedOn,
      },
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: true, message: "Failed to update note" });
  }
});

// Delete a note
app.delete("/api/notes/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = req.user.sub;

    const note = await Note.findOneAndDelete({ _id: id, clerkUserId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: true, message: "Failed to delete note" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("MongoDB connected successfully");
});
