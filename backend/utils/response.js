const { HTTP_STATUS, MESSAGES } = require("../constants");

/**
 * Send a successful response
 */
const sendSuccess = (
  res,
  statusCode = HTTP_STATUS.OK,
  message = null,
  data = null
) => {
  const response = { success: true };

  if (message) response.message = message;

  // If data is provided, merge it directly into the response
  // This maintains compatibility with the frontend expectations
  if (data) {
    Object.assign(response, data);
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
const sendError = (
  res,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message = null,
  error = null
) => {
  const response = { error: true };

  if (message) response.message = message;
  if (error && process.env.NODE_ENV === "development") {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
const sendValidationError = (res, message = MESSAGES.REQUIRED_FIELDS) => {
  return sendError(res, HTTP_STATUS.BAD_REQUEST, message);
};

/**
 * Send not found error response
 */
const sendNotFoundError = (res, message = MESSAGES.NOTE_NOT_FOUND) => {
  return sendError(res, HTTP_STATUS.NOT_FOUND, message);
};

/**
 * Send unauthorized error response
 */
const sendUnauthorizedError = (res, message = MESSAGES.INVALID_TOKEN) => {
  return sendError(res, HTTP_STATUS.UNAUTHORIZED, message);
};

/**
 * Send forbidden error response
 */
const sendForbiddenError = (res, message = "Access forbidden") => {
  return sendError(res, HTTP_STATUS.FORBIDDEN, message);
};

/**
 * Send internal server error response
 */
const sendInternalError = (
  res,
  message = "Internal server error",
  error = null
) => {
  return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message, error);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFoundError,
  sendUnauthorizedError,
  sendForbiddenError,
  sendInternalError,
};
