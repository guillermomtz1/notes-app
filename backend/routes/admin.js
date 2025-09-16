const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const { sendSuccess, sendValidationError } = require("../utils/response");
const { MESSAGES } = require("../constants");
const router = express.Router();

// Admin routes for user management
// Note: All subscription-related functionality has been removed

module.exports = router;
