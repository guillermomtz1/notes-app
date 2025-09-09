const express = require("express");
const notes = require("../routes/notes");
const webhooks = require("../routes/webhooks");
const admin = require("../routes/admin");

module.exports = function (app) {
  app.use("/api/notes", notes);
  app.use("/api/webhooks", webhooks);
  app.use("/api/admin", admin);
};
