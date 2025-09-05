const { HTTP_STATUS, MESSAGES, VALIDATION } = require("../constants");
const { sendValidationError } = require("../utils/response");

/**
 * Validate note creation data
 */
const validateNoteCreation = (req, res, next) => {
  const { title, content, date, tags } = req.body;

  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendValidationError(res, MESSAGES.EMPTY_BODY);
  }

  // Check required fields
  if (!title || !content || !date) {
    return sendValidationError(res, MESSAGES.REQUIRED_FIELDS);
  }

  // Validate title
  if (
    typeof title !== "string" ||
    title.trim().length < VALIDATION.NOTE.TITLE_MIN_LENGTH
  ) {
    return sendValidationError(res, "Title must be a non-empty string");
  }

  if (title.length > VALIDATION.NOTE.TITLE_MAX_LENGTH) {
    return sendValidationError(
      res,
      `Title must be less than ${VALIDATION.NOTE.TITLE_MAX_LENGTH} characters`
    );
  }

  // Validate content
  if (
    typeof content !== "string" ||
    content.trim().length < VALIDATION.NOTE.CONTENT_MIN_LENGTH
  ) {
    return sendValidationError(res, "Content must be a non-empty string");
  }

  if (content.length > VALIDATION.NOTE.CONTENT_MAX_LENGTH) {
    return sendValidationError(
      res,
      `Content must be less than ${VALIDATION.NOTE.CONTENT_MAX_LENGTH} characters`
    );
  }

  // Validate date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return sendValidationError(res, "Invalid date format");
  }

  // Validate tags
  if (tags && !Array.isArray(tags)) {
    return sendValidationError(res, "Tags must be an array");
  }

  if (tags && tags.length > VALIDATION.NOTE.TAGS_MAX_COUNT) {
    return sendValidationError(
      res,
      `Maximum ${VALIDATION.NOTE.TAGS_MAX_COUNT} tags allowed`
    );
  }

  if (
    tags &&
    tags.some((tag) => typeof tag !== "string" || tag.trim().length === 0)
  ) {
    return sendValidationError(res, "All tags must be non-empty strings");
  }

  next();
};

/**
 * Validate note update data
 */
const validateNoteUpdate = (req, res, next) => {
  const { title, content, date, tags } = req.body;

  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendValidationError(res, MESSAGES.EMPTY_BODY);
  }

  // Validate title if provided
  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      title.trim().length < VALIDATION.NOTE.TITLE_MIN_LENGTH
    ) {
      return sendValidationError(res, "Title must be a non-empty string");
    }
    if (title.length > VALIDATION.NOTE.TITLE_MAX_LENGTH) {
      return sendValidationError(
        res,
        `Title must be less than ${VALIDATION.NOTE.TITLE_MAX_LENGTH} characters`
      );
    }
  }

  // Validate content if provided
  if (content !== undefined) {
    if (
      typeof content !== "string" ||
      content.trim().length < VALIDATION.NOTE.CONTENT_MIN_LENGTH
    ) {
      return sendValidationError(res, "Content must be a non-empty string");
    }
    if (content.length > VALIDATION.NOTE.CONTENT_MAX_LENGTH) {
      return sendValidationError(
        res,
        `Content must be less than ${VALIDATION.NOTE.CONTENT_MAX_LENGTH} characters`
      );
    }
  }

  // Validate date if provided
  if (date !== undefined) {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return sendValidationError(res, "Invalid date format");
    }
  }

  // Validate tags if provided
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return sendValidationError(res, "Tags must be an array");
    }
    if (tags.length > VALIDATION.NOTE.TAGS_MAX_COUNT) {
      return sendValidationError(
        res,
        `Maximum ${VALIDATION.NOTE.TAGS_MAX_COUNT} tags allowed`
      );
    }
    if (
      tags.some((tag) => typeof tag !== "string" || tag.trim().length === 0)
    ) {
      return sendValidationError(res, "All tags must be non-empty strings");
    }
  }

  next();
};

module.exports = {
  validateNoteCreation,
  validateNoteUpdate,
};
