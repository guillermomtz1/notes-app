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

app.use(cors({ origin: "*" }));

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
    const { title, content, date, tags } = req.body;
    const clerkUserId = req.user.sub;

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
    console.error("Create note error:", error);
    res.status(500).json({ error: true, message: "Failed to create note" });
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

app.listen(8000, () => {
  console.log("Server running on port 8000");
  console.log("MongoDB connected successfully");
});
