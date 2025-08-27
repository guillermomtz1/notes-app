const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    index: true, // For faster queries
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tags: [{
    type: String,
  }],
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedOn field before saving
noteSchema.pre('save', function(next) {
  this.updatedOn = new Date();
  next();
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
