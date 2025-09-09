// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Response Messages
const MESSAGES = {
  // Success messages
  NOTE_CREATED: "Note created successfully",
  NOTE_UPDATED: "Note updated successfully",
  NOTE_DELETED: "Note deleted successfully",

  // Error messages
  NO_TOKEN: "No token provided",
  INVALID_TOKEN: "Invalid token",
  INVALID_TOKEN_PAYLOAD: "Invalid token payload",
  UNAUTHORIZED_USER: "Unauthorized: missing user id",
  EMPTY_BODY: "Empty JSON body received",
  REQUIRED_FIELDS: "Title, content, and date are required",
  NOTE_NOT_FOUND: "Note not found",
  FAILED_CREATE: "Failed to create note",
  FAILED_FETCH: "Failed to fetch notes",
  FAILED_FETCH_SINGLE: "Failed to fetch note",
  FAILED_UPDATE: "Failed to update note",
  FAILED_DELETE: "Failed to delete note",
};

// Validation Rules
const VALIDATION = {
  NOTE: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000,
    TAGS_MAX_COUNT: 10,
  },
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  VALIDATION,
};
