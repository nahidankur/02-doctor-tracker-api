import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // CastError (Invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid resource ID format: ${err.value}`);
  }

  // Duplicate key error (code 11000)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue || {});
    error = ApiError.conflict(`Duplicate value entered for unique field: ${keys.join(", ")}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest("Database validation error", errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error occurred";

  if (statusCode === 500) {
    console.error("💥 Unhandled Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
