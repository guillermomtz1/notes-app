const { HTTP_STATUS } = require("../constants");
const { sendInternalError } = require("../utils/response");

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: true,
      message: "Validation Error",
      details: errors,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: true,
      message: "Invalid ID format",
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: true,
      message: "Duplicate field value",
    });
  }

  // Default error
  return sendInternalError(res, "Something went wrong", err);
};

/**
 * Handle async errors in route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: true,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
};
